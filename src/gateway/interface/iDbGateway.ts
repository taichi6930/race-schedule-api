export interface IDBGateway {
    /** Execute a query and return all rows. */
    queryAll: (sql: string, params: any[]) => Promise<{ results: any[] }>;

    /** Execute a statement that doesn't return rows. */
    run: (sql: string, params: any[]) => Promise<any>;
}
