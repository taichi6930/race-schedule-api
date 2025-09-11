import Database from 'better-sqlite3';

import type { IDBGateway } from '../../src/gateway/interface/iDbGateway';

// テスト用の最低限のCloudFlareEnv型
export interface TestCloudFlareEnv {
    DB: {
        prepare: (sql: string) => {
            bind: (...params: any[]) => {
                run: () => any;
                all: () => { results: any[] };
            };
        };
    };
}

export interface TestIDBGateway {
    queryAll: (
        env: TestCloudFlareEnv,
        sql: string,
        params: any[],
    ) => Promise<{ results: any[] }>;
    run: (env: TestCloudFlareEnv, sql: string, params: any[]) => Promise<any>;
}

export class TestDatabaseSetup {
    private readonly db: Database.Database;

    public constructor() {
        // メモリ上にSQLiteを作成
        this.db = new Database(':memory:');
        this.setupSchema();
    }

    private setupSchema(): void {
        this.db.exec(`
            CREATE TABLE place (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                date_time TEXT NOT NULL,
                location_name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE held_day (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                held_times INTEGER,
                held_day_times INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE place_grade (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                grade TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE player (
                race_type TEXT NOT NULL,
                player_no TEXT NOT NULL,
                player_name TEXT NOT NULL,
                priority INTEGER NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (race_type, player_no)
            );

            CREATE TABLE race (
                id TEXT PRIMARY KEY,
                place_id TEXT NOT NULL,
                race_type TEXT NOT NULL,
                race_name TEXT NOT NULL,
                date_time DATETIME NOT NULL,
                location_name TEXT NOT NULL,
                grade TEXT NOT NULL,
                race_number INTEGER NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE race_condition (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                surface_type TEXT NOT NULL,
                distance INTEGER NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE race_stage (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                stage INTEGER NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE race_player (
                id TEXT PRIMARY KEY,
                race_type TEXT NOT NULL,
                race_id TEXT NOT NULL,
                position_number INTEGER NOT NULL,
                player_number INTEGER NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public createMockEnv(): TestCloudFlareEnv {
        return {
            DB: {
                prepare: (sql: string) => ({
                    bind: (...params: any[]) => ({
                        run: () => this.db.prepare(sql).run(...params),
                        all: () => ({
                            results: this.db.prepare(sql).all(...params),
                        }),
                    }),
                }),
            },
        };
    }
}

export class MockDbGateway implements IDBGateway {
    public constructor(private readonly env: TestCloudFlareEnv) {}

    public async queryAll(
        env: TestCloudFlareEnv,
        sql: string,
        params: any[],
    ): Promise<{ results: any[] }> {
        return env.DB.prepare(sql)
            .bind(...params)
            .all();
    }

    public async run(
        env: TestCloudFlareEnv,
        sql: string,
        params: any[],
    ): Promise<any> {
        return env.DB.prepare(sql)
            .bind(...params)
            .run();
    }
}
