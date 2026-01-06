/**
 * DBゲートウェイのインターフェース
 */
export interface IDBGateway {
    /** クエリを実行し、すべての行を返す */
    queryAll: (sql: string, params: any[]) => Promise<{ results: any[] }>;

    /** 行を返さないステートメントを実行する */
    run: (sql: string, params: any[]) => Promise<any>;
}
