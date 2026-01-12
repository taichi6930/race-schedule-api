export interface IR2Gateway {
    /**
     * R2バケットにオブジェクトを保存
     */
    putObject: (
        bucket: string,
        key: string,
        body: Buffer | string,
        contentType?: string,
    ) => Promise<void>;

    /**
     * R2バケットからオブジェクトを取得
     */
    getObject: (bucket: string, key: string) => Promise<Buffer | null>;

    /**
     * R2バケットからオブジェクトを削除
     */
    deleteObject: (bucket: string, key: string) => Promise<void>;
}
