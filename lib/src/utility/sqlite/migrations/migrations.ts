import type { Database } from 'better-sqlite3';

import { SCHEMA_QUERIES } from '../schema';


export class DatabaseMigration {
    public constructor(private readonly db: Database) {}

    
    private tableExists(tableName: string): boolean {
        const stmt = this.db.prepare<
            [string, string],
            { name: string | undefined }
        >('SELECT name FROM sqlite_master WHERE type = ? AND name = ?');
        const result = stmt.get('table', tableName);
        return result?.name !== undefined;
    }

    
    public migrate(): void {
        
        this.db.transaction(() => {
            
            for (const query of SCHEMA_QUERIES) {
                this.db.exec(query);
            }
        })();
    }
}
