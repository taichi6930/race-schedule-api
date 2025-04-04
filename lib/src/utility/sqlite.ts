import fs from 'node:fs';
import path from 'node:path';

import BetterSQLite3 from 'better-sqlite3';

import { allowedEnvs, ENV } from './env';

type DB = BetterSQLite3.Database;

interface DatabaseInstance {
    db: DB;
    initialized: boolean;
}

export class SQLiteManager {
    private static instance: SQLiteManager | undefined;
    private dbInstance: DatabaseInstance | undefined;
    private readonly dbPath: string;

    private constructor() {
        // 環境に応じてDBのパスを変更
        this.dbPath =
            ENV === allowedEnvs.local
                ? path.join(process.cwd(), 'data', 'race_schedule.db')
                : path.join('/mnt/sqlite', 'race_schedule.db');

        // ローカル環境の場合、データディレクトリを作成
        if (ENV === allowedEnvs.local) {
            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
                console.log(`データディレクトリを作成しました: ${dataDir}`);
            }
            console.log(`SQLiteデータベースパス: ${this.dbPath}`);
        }
    }

    public static getInstance(): SQLiteManager {
        SQLiteManager.instance ??= new SQLiteManager();
        return SQLiteManager.instance;
    }

    private createDatabase(): DatabaseInstance {
        try {
            const db = new BetterSQLite3(this.dbPath, {
                verbose: console.log,
            });
            return { db, initialized: false };
        } catch (error) {
            console.error('Failed to create database:', error);
            throw new Error('Database initialization failed');
        }
    }

    public getDatabase(): DB {
        this.dbInstance ??= this.createDatabase();

        if (!this.dbInstance.initialized) {
            this.initializeDatabase(this.dbInstance.db);
            this.dbInstance.initialized = true;
        }

        return this.dbInstance.db;
    }

    private initializeDatabase(db: DB): void {
        try {
            // レーステーブルの作成
            db.exec(`
                CREATE TABLE IF NOT EXISTS races (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    place_id TEXT NOT NULL,
                    start_date TEXT NOT NULL,
                    end_date TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            `);

            // 場所テーブルの作成
            db.exec(`
                CREATE TABLE IF NOT EXISTS places (
                    id TEXT PRIMARY KEY,
                    dateTime TEXT NOT NULL,
                    location TEXT NOT NULL,
                    type TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            `);

            // インデックスの作成
            db.exec(`
                CREATE INDEX IF NOT EXISTS idx_races_start_date ON races(start_date);
                CREATE INDEX IF NOT EXISTS idx_races_type ON races(type);
                CREATE INDEX IF NOT EXISTS idx_places_type ON places(type);
            `);
        } catch (error) {
            console.error('Failed to initialize database schema:', error);
            throw new Error('Database schema initialization failed');
        }
    }

    public closeConnection(): void {
        const instance = this.dbInstance;
        if (instance?.db !== undefined) {
            try {
                instance.db.close();
                this.dbInstance = undefined;
            } catch (error) {
                console.error('Failed to close database connection:', error);
            }
        }
    }
}

export function withDatabase<T>(operation: (db: DB) => T): T {
    const manager = SQLiteManager.getInstance();
    try {
        const db = manager.getDatabase();
        return operation(db);
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}
