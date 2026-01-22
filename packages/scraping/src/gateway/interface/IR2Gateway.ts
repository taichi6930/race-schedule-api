export interface IR2Gateway {
    /**
     * R2バケットにオブジェクトを保存
     */

    putObject: (
        key: string,
        body: string | ArrayBuffer,
        contentType?: string,
    ) => Promise<void>;

    /**
     * R2バケットからオブジェクトを取得
     */
    getObject: (key: string) => Promise<string | null>;

    /**
     * R2バケットからオブジェクトを削除
     */
    deleteObject: (key: string) => Promise<void>;
}
