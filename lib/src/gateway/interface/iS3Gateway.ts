import type { IRecord } from '../record/iRecord';

/**
 * Interface for S3Gateway
 */
export interface IS3Gateway<T extends IRecord<T>> {
    /**
     * S3にデータをアップロードする
     * @param data
     * @param fileName
     */
    uploadDataToS3: (data: T[], fileName: string) => Promise<void>;
    /**
     * S3からデータを取得する
     * @param fileName
     */
    fetchDataFromS3: (fileName: string) => Promise<string>;
}
