import type { Database } from 'better-sqlite3';

import { SCHEMA_QUERIES } from './schema/index';

interface TableResult {
    name: string | undefined;
}


export class DatabaseMigration {
    public constructor(private readonly db: Database) {}

    
    private tableExists(tableName: string): boolean {
        const stmt = this.db.prepare<[string, string], TableResult>(
            'SELECT name FROM sqlite_master WHERE type = ? AND name = ?',
        );
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
