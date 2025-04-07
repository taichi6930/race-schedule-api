import { existsSync, mkdir } from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

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
        // レースデータテーブルの作成
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS races (
                id TEXT PRIMARY KEY,
                dateTime TEXT NOT NULL,
                location TEXT NOT NULL,
                type TEXT CHECK(type IN ('${Object.values(RaceType).join("','")}')) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    /**
     * データベースファイルのパスを取得
     */
    private getDatabasePath(): string {
        // ローカル環境では./volume/db配下に保存
        const baseDir = path.join(process.cwd(), 'volume', 'db');
        return path.join(baseDir, 'race-schedule.db');
    }

    /**
     * ディレクトリが存在しない場合は作成
     */
    private ensureDirectoryExists(dirPath: string): void {
        if (!existsSync(dirPath)) {
            mkdir(dirPath, { recursive: true }, (error) => {
                if (error) {
                    throw error;
                }
            });
        }
    }

    /**
     * データベース接続をクローズ
     */
    public close(): void {
        this.db.close();
    }
}
