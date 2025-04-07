import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

import { allowedEnvs } from '../../../test/utility/testDecorators';
import { ENV } from './env';

/**
 * レースタイプの列挙型
 */
export enum RaceType {
    JRA = 'JRA',
    NAR = 'NAR',
    KEIRIN = 'KEIRIN',
    WORLD = 'WORLD',
    AUTORACE = 'AUTORACE',
    BOATRACE = 'BOATRACE',
}

/**
 * SQLiteデータベースマネージャークラス
 */
export class SQLiteManager {
    private static instance: SQLiteManager | undefined;
    private readonly db: Database.Database;

    private constructor() {
        const dbPath = this.getDatabasePath();
        this.ensureDirectoryExists(path.dirname(dbPath));
        this.db = new Database(dbPath);
        this.initialize();
    }

    /**
     * シングルトンインスタンスを取得
     */
    public static getInstance(): SQLiteManager {
        SQLiteManager.instance ??= new SQLiteManager();
        return SQLiteManager.instance;
    }

    /**
     * データベースインスタンスを取得
     */
    public getDatabase(): Database.Database {
        return this.db;
    }

    /**
     * データベースを初期化
     */
    private initialize(): void {
        // 開催場データテーブルの作成
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS places (
                id TEXT PRIMARY KEY,
                dateTime DATETIME NOT NULL,
                location TEXT NOT NULL,
                type TEXT CHECK(type IN ('${Object.values(RaceType).join("','")}')) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // レースデータテーブルの作成
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS races (
                id TEXT NOT NULL,
                number INTEGER NOT NULL,
                dateTime DATETIME NOT NULL,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id, number)
            );
        `);

        // 競馬情報テーブルの作成
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS horse_race_info (
                id TEXT NOT NULL,
                number INTEGER NOT NULL,
                surfaceType TEXT NOT NULL,
                distance INTEGER NOT NULL,
                grade TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id, number)
            );
        `);
    }

    /**
     * データベースファイルのパスを取得
     */
    private getDatabasePath(): string {
        // 本番環境では/mnt/efs/db配下に保存
        switch (ENV) {
            case allowedEnvs.production:
            case allowedEnvs.test: {
                const baseDir = path.join('/mnt/efs', 'db');
                return path.join(baseDir, 'race-schedule.db');
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                const baseDir = path.join(process.cwd(), 'volume', 'db');
                return path.join(baseDir, 'race-schedule.db');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    /**
     * ディレクトリが存在しない場合は作成
     */
    private ensureDirectoryExists(dirPath: string): void {
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * データベース接続をクローズ
     */
    public close(): void {
        this.db.close();
    }
}
