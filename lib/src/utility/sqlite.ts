import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

import { SCHEMA_QUERIES } from './sqlite/schema';

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
        const dbPath = path.join(
            process.cwd(),
            'volume',
            'data',
            'race-schedule.db',
        );
        const dbDir = path.dirname(dbPath);

        if (!existsSync(dbDir)) {
            mkdirSync(dbDir, { recursive: true });
        }

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
        // マイグレーションの実行
        this.migrate();
    }

    /**
     * マイグレーションを実行
     */
    private migrate(): void {
        // トランザクションを開始
        const transaction = this.db.transaction(() => {
            // 各クエリを実行
            for (const query of SCHEMA_QUERIES) {
                this.db.exec(query);
            }
        });

        // トランザクションを実行
        transaction();
    }

    /**
     * テーブルが存在するかチェック
     * @param tableName - テーブル名
     * @returns - テーブルが存在すればtrue
     */
    private tableExists(tableName: string): boolean {
        const result = this.db
            .prepare(
                "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            )
            .get(tableName);
        return Boolean(result);
    }

    /**
     * データベース接続をクローズ
     */
    public close(): void {
        this.db.close();
    }
}
