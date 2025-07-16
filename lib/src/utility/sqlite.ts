import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

import {
    PLAYER_DATA_INDEX_QUERIES,
    PLAYER_DATA_SCHEMA_QUERIES,
    PLAYER_DATA_TABLE_QUERIES,
    PLAYER_DATA_TRIGGER_QUERIES,
} from '../../sql/table/playerDataTable';
import { SCHEMA_QUERIES } from './sqlite/schema/index';

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
 * 汎用SQLiteデータベースマネージャークラス
 *
 * 用途ごとに getInstanceForSchedule(), getInstanceForSetting() を利用してください。
 */
export class SQLiteManager {
    private static scheduleInstance: SQLiteManager | undefined;
    private static settingInstance: SQLiteManager | undefined;
    private readonly db: Database.Database;

    private constructor(dbFileName: string, schemaQueries: string[]) {
        const dbPath = path.join(process.cwd(), 'volume', 'data', dbFileName);
        const dbDir = path.dirname(dbPath);
        if (!existsSync(dbDir)) {
            mkdirSync(dbDir, { recursive: true });
        }
        this.db = new Database(dbPath);
        this.initialize([
            ...schemaQueries,
            ...PLAYER_DATA_SCHEMA_QUERIES,
            ...PLAYER_DATA_INDEX_QUERIES,
            ...PLAYER_DATA_TRIGGER_QUERIES,
        ]);
    }

    /**
     * レーススケジュール用インスタンス取得
     */
    public static getInstanceForSchedule(): SQLiteManager {
        SQLiteManager.scheduleInstance ??= new SQLiteManager(
            'race-schedule.db',
            SCHEMA_QUERIES,
        );
        return SQLiteManager.scheduleInstance;
    }

    /**
     * レース設定用インスタンス取得
     */
    public static getInstanceForSetting(): SQLiteManager {
        SQLiteManager.settingInstance ??= new SQLiteManager(
            'race-setting.db',
            PLAYER_DATA_TABLE_QUERIES,
        );
        return SQLiteManager.settingInstance;
    }

    /**
     * データベースインスタンスを取得
     */
    public getDatabase(): Database.Database {
        return this.db;
    }

    /**
     * データベースを初期化
     * @param schemaQueries - スキーマクエリ配列
     */
    private initialize(schemaQueries: string[]): void {
        this.migrate(schemaQueries);
    }

    /**
     * マイグレーションを実行
     * @param schemaQueries - スキーマクエリ配列
     */
    private migrate(schemaQueries: string[]): void {
        const transaction = this.db.transaction(() => {
            for (const query of schemaQueries) {
                this.db.exec(query);
            }
        });
        transaction();
    }

    /**
     * テーブルが存在するかチェック
     * @param tableName - テーブル名
     * @returns - テーブルが存在すればtrue
     */
    public tableExists(tableName: string): boolean {
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
