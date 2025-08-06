import * as fs from 'node:fs';
import { Readable } from 'node:stream';

import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import Database, { Database as DatabaseType } from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { allowedEnvs, ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
import type { ISQLiteGateway } from '../interface/ISQLiteGateway';

/**
 * SQLiteS3Gateway
 * ローカル環境とLambda + S3環境の両方に対応したSQLiteゲートウェイ
 */
@injectable()
export class SQLiteGateway implements ISQLiteGateway {
    private db: DatabaseType | undefined = undefined;
    private readonly isLambdaEnvironment: boolean;
    private readonly s3Client?: S3Client;
    private readonly bucketName?: string;
    private readonly s3Key?: string;
    private readonly localDbPath?: string;
    private readonly tmpDbPath: string = '/tmp/database.db';
    private dbInitialized = false;
    private lastDownloadTime = 0;
    private readonly cacheTimeout: number = 5 * 60 * 1000; // 5分のキャッシュ

    /**
     * コンストラクタ
     * @param config - 設定オブジェクト
     * @param config.dbPath
     * @param config.bucketName
     * @param config.s3Key
     * @param config.region
     * @param config.useCache
     * @param config.cacheTimeout
     */
    public constructor(config: {
        dbPath?: string; // ローカル環境用のDBパス
        bucketName?: string; // S3バケット名
        s3Key?: string; // S3内のDBファイルのキー
    }) {
        // Lambda環境かどうかを判定
        this.isLambdaEnvironment =
            ENV == allowedEnvs.production || ENV == allowedEnvs.test;

        if (this.isLambdaEnvironment) {
            // Lambda環境の設定
            if (config.bucketName == undefined || config.s3Key == undefined) {
                throw new Error('Lambda環境ではbucketNameとs3Keyが必要です');
            }
            this.s3Client = new S3Client({ region: 'ap-northeast-1' });
            this.bucketName = config.bucketName;
            this.s3Key = config.s3Key;

            console.log(
                `SQLiteS3Gateway: Lambda mode - Bucket: ${this.bucketName}, Key: ${this.s3Key}`,
            );
        } else {
            // ローカル環境の設定
            if (config.dbPath == undefined) {
                throw new Error('ローカル環境ではdbPathが必要です');
            }
            this.localDbPath = config.dbPath;
            console.log(
                `SQLiteS3Gateway: Local mode - Path: ${this.localDbPath}`,
            );
        }
    }

    /**
     * データベースを初期化
     */
    private async initializeDatabase(): Promise<void> {
        if (this.dbInitialized && this.db) {
            // キャッシュが有効かチェック（Lambda環境のみ）
            if (this.isLambdaEnvironment) {
                const now = Date.now();
                if (now - this.lastDownloadTime < this.cacheTimeout) {
                    return; // キャッシュが有効
                }
            } else {
                return; // ローカル環境では常に同じDBを使用
            }
        }

        try {
            if (this.isLambdaEnvironment) {
                await this.downloadFromS3();
                this.db = new Database(this.tmpDbPath);
                this.lastDownloadTime = Date.now();
            } else {
                this.db = new Database(this.localDbPath);
            }

            this.db.pragma('journal_mode = WAL');
            this.dbInitialized = true;
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * S3からデータベースファイルをダウンロード
     */
    private async downloadFromS3(): Promise<void> {
        if (
            this.s3Client == undefined ||
            this.bucketName == undefined ||
            this.s3Key == undefined
        ) {
            throw new Error('S3設定が不完全です');
        }

        try {
            console.log(
                `Downloading database from S3: ${this.bucketName}/${this.s3Key}`,
            );

            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: this.s3Key,
            });

            const response = await this.s3Client.send(command);

            if (response.Body) {
                const stream = response.Body as Readable;
                const writeStream = fs.createWriteStream(this.tmpDbPath);

                await new Promise<void>((resolve, reject) => {
                    stream
                        .pipe(writeStream)
                        .on('finish', resolve)
                        .on('error', reject);
                });

                console.log('Database downloaded successfully');
            } else {
                throw new Error('No body in S3 response');
            }
        } catch (error) {
            console.error('Error downloading from S3:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * S3にデータベースファイルをアップロード
     */
    @Logger
    private async uploadToS3(): Promise<void> {
        if (
            this.s3Client == undefined ||
            this.bucketName == undefined ||
            this.s3Key == undefined
        ) {
            throw new Error('S3設定が不完全です');
        }

        try {
            // Lambda環境では/tmp/database.db、ローカルではlocalDbPathをアップロード
            let dbPath = '';
            if (this.isLambdaEnvironment) {
                dbPath = this.tmpDbPath;
            } else {
                if (
                    typeof this.localDbPath !== 'string' ||
                    this.localDbPath === ''
                ) {
                    throw new Error('ローカル環境ではlocalDbPathが必要です');
                }
                dbPath = this.localDbPath;
            }
            const fileContent = fs.readFileSync(dbPath);

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: this.s3Key,
                Body: fileContent,
                ContentType: 'application/x-sqlite3',
            });

            await this.s3Client.send(command);
            console.log(
                `Database uploaded to S3: ${this.bucketName}/${this.s3Key}`,
            );
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * データベースを確実に取得
     */
    @Logger
    private async ensureDatabase(): Promise<DatabaseType> {
        await this.initializeDatabase();
        if (!this.db) {
            throw new Error('Database initialization failed');
        }
        return this.db;
    }

    /**
     * トランザクションラップメソッド
     * @param fn - トランザクション内で実行する関数
     * @param syncToS3 - トランザクション成功後にS3に同期するか
     */
    @Logger
    public async transaction<T>(fn: () => T, syncToS3 = false): Promise<T> {
        const db = await this.ensureDatabase();

        try {
            db.prepare('BEGIN TRANSACTION').run();
            const result = fn();
            db.prepare('COMMIT').run();

            // Lambda環境でsyncToS3がtrueの場合、S3に同期
            if (this.isLambdaEnvironment && syncToS3) {
                await this.uploadToS3();
            }

            return result;
        } catch (error) {
            db.prepare('ROLLBACK').run();
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * クエリを実行（書き込み）
     * @param query - SQLクエリ
     * @param params - パラメータ
     * @param syncToS3 - 実行後にS3に同期するか
     */
    @Logger
    public async run(
        query: string,
        params: unknown[] = [],
        syncToS3 = false,
    ): Promise<void> {
        const db = await this.ensureDatabase();

        try {
            db.prepare(query).run(...params);

            // Lambda環境でsyncToS3がtrueの場合、S3に同期
            if (this.isLambdaEnvironment && syncToS3) {
                await this.uploadToS3();
            }
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * 単一行を取得
     * @param query - SQLクエリ
     * @param params - パラメータ
     */
    @Logger
    public async get<T>(
        query: string,
        params: unknown[] = [],
    ): Promise<T | undefined> {
        const db = await this.ensureDatabase();

        try {
            const row = db.prepare(query).get(...params);

            return row as T | undefined;
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * 複数行を取得
     * @param query - SQLクエリ
     * @param params - パラメータ
     */
    @Logger
    public async all<T>(query: string, params: unknown[] = []): Promise<T[]> {
        const db = await this.ensureDatabase();

        try {
            const rows = db.prepare(query).all(...params);

            return Array.isArray(rows) ? (rows as T[]) : [];
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * バッチ処理（複数のクエリを一括実行）
     * @param operations - 実行する操作の配列
     * @param syncToS3 - 実行後にS3に同期するか
     */
    @Logger
    public async batch(
        operations: { query: string; params?: unknown[] }[],
        syncToS3 = false,
    ): Promise<void> {
        const db = await this.ensureDatabase();

        const executeAll = db.transaction(() => {
            for (const op of operations) {
                db.prepare(op.query).run(...(op.params ?? []));
            }
        });

        try {
            executeAll();

            // Lambda環境でsyncToS3がtrueの場合、S3に同期
            if (this.isLambdaEnvironment && syncToS3) {
                await this.uploadToS3();
            }
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * データベースを閉じる
     */
    public close(): void {
        if (this.db) {
            this.db.close();
            this.db = undefined;
            this.dbInitialized = false;
        }

        // Lambda環境では一時ファイルも削除
        if (this.isLambdaEnvironment && fs.existsSync(this.tmpDbPath)) {
            fs.unlinkSync(this.tmpDbPath);
            console.log('Temporary database file deleted');
        }
    }

    /**
     * デストラクタ的な処理（必要に応じて手動で呼び出し）
     */
    public cleanup(): void {
        this.close();
    }
}
