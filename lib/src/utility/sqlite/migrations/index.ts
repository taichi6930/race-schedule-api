import type { Database } from 'better-sqlite3';

import { SCHEMA_QUERIES } from '../schema';

/**
 * マイグレーション実行クラス
 */
export class MigrationRunner {
    public constructor(private readonly db: Database) {}

    /**
     * 全てのマイグレーションを実行
     */
    public run(): void {
        console.log('マイグレーションを実行します...');

        try {
            // トランザクションを開始
            this.db.transaction(() => {
                // 各クエリを実行
                for (const query of SCHEMA_QUERIES) {
                    this.db.exec(query);
                }
            })();

            console.log('マイグレーションが完了しました。');
        } catch (error) {
            console.error(
                'マイグレーション実行中にエラーが発生しました:',
                error,
            );
            throw error;
        }
    }
}
