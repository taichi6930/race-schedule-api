// SQLiteの基本的なCRUD操作を抽象化するインターフェース

export interface ISQLiteGateway {
    /**
     * INSERT/UPDATE/DELETEなどのクエリを実行
     */
    run: (query: string, params?: unknown[]) => Promise<void>;

    /**
     * 1件取得用クエリ
     */
    get: <T>(query: string, params?: unknown[]) => Promise<T | undefined>;

    /**
     * 複数件取得用クエリ
     */
    all: <T>(query: string, params?: unknown[]) => Promise<T[]>;
}
