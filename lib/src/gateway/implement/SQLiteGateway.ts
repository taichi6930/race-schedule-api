/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

import Database, { Database as DatabaseType } from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { Logger } from '../../utility/logger';
import type { ISQLiteGateway } from '../interface/ISQLiteGateway';

@injectable()
export class SQLiteGateway implements ISQLiteGateway {
    private readonly db: DatabaseType;

    public constructor(dbPath: string) {
        // デバッグ用のログ出力
        console.log(`SQLiteGateway: Opening database at ${dbPath}`);
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
    }

    /**
     * トランザクションラップメソッド
     * @param fn - トランザクション内で実行する関数
     */
    @Logger
    public transaction<T>(fn: () => T): T {
        try {
            this.db.prepare('BEGIN TRANSACTION').run();
            const result = fn();
            this.db.prepare('COMMIT').run();
            return result;
        } catch (error) {
            this.db.prepare('ROLLBACK').run();
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    @Logger
    public run(query: string, params: unknown[] = []): void {
        try {
            this.db.prepare(query).run(...params);
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    @Logger
    public get<T>(query: string, params: unknown[] = []): T | undefined {
        try {
            const row = this.db.prepare(query).get(...params);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            return row as T | undefined;
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    @Logger
    public all<T>(query: string, params: unknown[] = []): T[] {
        try {
            const rows = this.db.prepare(query).all(...params);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            return Array.isArray(rows) ? (rows as T[]) : [];
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
}
