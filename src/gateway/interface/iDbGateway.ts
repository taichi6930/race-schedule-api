import type { CloudFlareEnv } from '../../utility/commonParameter';

export interface IDBGateway {
    /** Execute a query and return all rows. */
    queryAll: (
        env: CloudFlareEnv,
        sql: string,
        params?: any[],
    ) => Promise<{ results: any[] }>;

    /** Execute a statement that doesn't return rows. */
    run: (env: CloudFlareEnv, sql: string, params?: any[]) => Promise<any>;
}
