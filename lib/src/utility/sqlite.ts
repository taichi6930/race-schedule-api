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
        // 開催場データテーブルの作成
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS place_data (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                datetime TEXT NOT NULL,
                location TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
                updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
            );

            -- updated_atを自動更新するトリガーを作成
            DROP TRIGGER IF EXISTS update_place_timestamp;
            CREATE TRIGGER update_place_timestamp AFTER UPDATE ON place_data
            BEGIN
                UPDATE place_data SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
            END;
        `);

        // レース開催回数データテーブルの作成
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS place_held_data (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                held_times INTEGER NOT NULL,
                held_day_times INTEGER NOT NULL,
                created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
                updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
            );

            -- updated_atを自動更新するトリガーを作成
            DROP TRIGGER IF EXISTS update_place_held_timestamp;
            CREATE TRIGGER update_place_held_timestamp AFTER UPDATE ON place_held_data
            BEGIN
                UPDATE place_held_data SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
            END;
        `);
    }

    /**
     * データベースファイルのパスを取得
     */
    private getDatabasePath(): string {
        // ローカル環境では./volume/db配下に保存
        const baseDir = path.join(process.cwd(), 'volume', 'data');
        return path.join(baseDir, 'race-schedule.db');
    }

    /**
     * ディレクトリが存在しない場合は作成
     * @param dirPath
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
