import type { Database } from 'better-sqlite3';

import { SCHEMA_QUERIES } from '../schema';

/**
 * マイグレーション管理クラス
 */
export class DatabaseMigration {
    public constructor(private readonly db: Database) {}

    /**
     * テーブルが存在するかチェックする
     * @param tableName - テーブル名
     * @returns テーブルが存在すればtrue
     */
    private tableExists(tableName: string): boolean {
        const stmt = this.db.prepare<
            [string, string],
            { name: string | undefined }
        >('SELECT name FROM sqlite_master WHERE type = ? AND name = ?');
        const result = stmt.get('table', tableName);
        return result?.name !== undefined;
    }

    /**
     * マイグレーションを実行する
     */
    public migrate(): void {
        // トランザクションを開始
        this.db.transaction(() => {
            // 各クエリを実行
            for (const query of SCHEMA_QUERIES) {
                this.db.exec(query);
            }
        })();
    }
}
