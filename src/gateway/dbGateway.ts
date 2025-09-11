import type { CloudFlareEnv } from '../utility/commonParameter';

/** Gateway that centralizes low-level D1 operations. */
export const DBGateway = {
    /**
     * Execute a query and return all rows.
     * @param env - CloudFlare env that contains D1 database
     * @param sql - SQL string
     * @param params - bind parameters
     */
    async queryAll(
        env: CloudFlareEnv,
        sql: string,
        params: any[] = [],
    ): Promise<{ results: any[] }> {
        return env.DB.prepare(sql)
            .bind(...params)
            .all();
    },

    /**
     * Execute a statement that doesn't return rows.
     * @param env - CloudFlare env that contains D1 database
     * @param sql - SQL string
     * @param params - bind parameters
     */
    async run(
        env: CloudFlareEnv,
        sql: string,
        params: any[] = [],
    ): Promise<any> {
        return env.DB.prepare(sql)
            .bind(...params)
            .run();
    },
};
