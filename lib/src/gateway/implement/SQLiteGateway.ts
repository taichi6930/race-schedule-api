import sqlite3 from 'sqlite3';

sqlite3.verbose();

import type { ISQLiteGateway } from '../interface/ISQLiteGateway';

export class SQLiteGateway implements ISQLiteGateway {
    private readonly db: sqlite3.Database;

    public constructor(dbPath: string) {
        this.db = new sqlite3.Database(dbPath);
    }

    /**
     * トランザクションラップメソッド
     * @param fn - トランザクション内で実行する関数
     */
    public async transaction<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.db.serialize(() => {
                void (async (): Promise<void> => {
                    try {
                        await this.run('BEGIN TRANSACTION');
                        const result = await fn();
                        await this.run('COMMIT');
                        resolve(result);
                    } catch (error: unknown) {
                        try {
                            await this.run('ROLLBACK');
                        } catch (rollbackError: unknown) {
                            reject(
                                rollbackError instanceof Error
                                    ? rollbackError
                                    : new Error(String(rollbackError)),
                            );
                            return;
                        }
                        reject(
                            error instanceof Error
                                ? error
                                : new Error(String(error)),
                        );
                    }
                })();
            });
        });
    }

    public async run(query: string, params: unknown[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    public async get<T>(
        query: string,
        params: unknown[] = [],
    ): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    reject(err instanceof Error ? err : new Error(String(err)));
                    return;
                }
                // Tは呼び出し側でobject型であることを保証する前提
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                resolve(row as T);
            });
        });
    }

    public async all<T>(query: string, params: unknown[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err instanceof Error ? err : new Error(String(err)));
                    return;
                }
                if (Array.isArray(rows)) {
                    // 各要素がobject型であることを期待（呼び出し側で担保）
                    // Tは呼び出し側でobject型であることを保証する前提
                    resolve(
                        rows.map((row) => {
                            if (typeof row === 'object') {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                                return row as unknown as T;
                            }
                            // 万一objectでなければ空objectを返す
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                            return {} as unknown as T;
                        }),
                    );
                } else {
                    resolve([]);
                }
            });
        });
    }
}
