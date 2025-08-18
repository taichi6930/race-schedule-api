

import Database, { Database as DatabaseType } from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { Logger } from '../../utility/logger';
import type { ISQLiteGateway } from '../interface/ISQLiteGateway';

@injectable()
export class SQLiteGateway implements ISQLiteGateway {
    private readonly db: DatabaseType;

    public constructor(dbPath: string) {
        
        console.log(`SQLiteGateway: Opening database at ${dbPath}`);
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
    }

    
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
            
            return row as T | undefined;
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    @Logger
    public async all<T>(query: string, params: unknown[] = []): Promise<T[]> {
        try {
            const rows = this.db.prepare(query).all(...params);

            return await Promise.resolve(
                
                Array.isArray(rows) ? (rows as T[]) : [],
            );
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
}
