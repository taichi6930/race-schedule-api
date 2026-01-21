/**
 * SQLパラメータとして許可される型
 */
export type SqlParameter = string | number | boolean | null | undefined;

/**
 * SQLクエリの実行結果型 (D1Result互換)
 */
export interface QueryResult {
    /** 変更された行数 */
    changes?: number;
    /** 最後に挿入された行のID */
    lastInsertRowid?: number | string;
    /** 実行成功フラグ */
    success?: boolean;
    /** エラーメッセージ */
    error?: string;
    /** メタ情報 */
    meta?: Record<string, unknown>;
}

/**
 * DBゲートウェイのインターフェース
 */
export interface IDBGateway {
    /** クエリを実行し、すべての行を返す */
    queryAll: (
        sql: string,
        params: SqlParameter[],
    ) => Promise<{ results: unknown[] }>;

    /** 行を返さないステートメントを実行する */
    run: (sql: string, params: SqlParameter[]) => Promise<QueryResult>;
}
