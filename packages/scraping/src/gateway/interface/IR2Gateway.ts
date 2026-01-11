export interface IR2Gateway {
    /**
     * R2バケットにオブジェクトを保存
     */
    putObject: (
        key: string,
        body: Buffer | string,
        contentType?: string,
    ) => Promise<void>;

    /**
     * R2バケットからオブジェクトを取得
     */
    getObject: (key: string) => Promise<Buffer | null>;

    /**
     * R2バケットからオブジェクトを削除
     */
    deleteObject: (key: string) => Promise<void>;
}
