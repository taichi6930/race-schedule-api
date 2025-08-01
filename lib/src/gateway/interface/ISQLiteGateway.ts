/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
// SQLiteの基本的なCRUD操作を抽象化するインターフェース

export interface ISQLiteGateway {
    /**
     * INSERT/UPDATE/DELETEなどのクエリを実行（同期）
     */
    run: (query: string, params?: unknown[]) => void;

    /**
     * 1件取得用クエリ（同期）
     */
    get: <T>(query: string, params?: unknown[]) => T | undefined;

    /**
     * 複数件取得用クエリ（同期）
     */
    all: <T>(query: string, params?: unknown[]) => T[];
}
