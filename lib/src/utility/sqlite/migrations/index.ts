import type { Database } from 'better-sqlite3';

import { SCHEMA_QUERIES } from '../schema';


export class MigrationRunner {
    public constructor(private readonly db: Database) {}

    
    public run(): void {
        console.log('マイグレーションを実行します...');

        try {
            
            this.db.transaction(() => {
                
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
