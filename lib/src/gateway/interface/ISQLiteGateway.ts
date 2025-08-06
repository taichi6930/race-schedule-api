// SQLiteの基本的なCRUD操作を抽象化するインターフェース

export interface ISQLiteGateway {
    transaction: <T>(fn: () => T, syncToS3?: boolean) => Promise<T>;
    run: (
        query: string,
        params?: unknown[],
        syncToS3?: boolean,
    ) => Promise<void>;
    get: <T>(query: string, params?: unknown[]) => Promise<T | undefined>;
    all: <T>(query: string, params?: unknown[]) => Promise<T[]>;
    batch?: (
        operations: { query: string; params?: unknown[] }[],
        syncToS3?: boolean,
    ) => Promise<void>;
    close?: () => void;
    cleanup?: () => void;
}
