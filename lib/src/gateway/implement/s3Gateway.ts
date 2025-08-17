import * as fs from 'node:fs';
import { Readable } from 'node:stream';

import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { injectable } from 'tsyringe';

import { Logger } from '../../utility/logger';
import { IS3Gateway } from '../interface/iS3Gateway';
import { IRecord } from '../record/iRecord';

/**
 * S3Gateway
 */
@injectable()
export class S3Gateway<T extends IRecord<T>> implements IS3Gateway<T> {
    /**
     * AWS SDKのS3Client
     * @type {S3Client}
     * @private
     */
    private readonly s3Client: S3Client;
    /**
     * バケット名 S3の中にあるデータの保存場所
     * @type {string}
     * @private
     */
    private readonly bucketName: string;

    /**
     * S3Gatewayのコンストラクタ
     * @param {string} bucketName
     */
    public constructor(bucketName: string) {
        // S3Clientの初期化 東京リージョン
        this.s3Client = new S3Client({ region: 'ap-northeast-1' });
        this.bucketName = bucketName;
    }

    /**
     * データをS3にアップロードする
     * @param data
     * @param folderPath
     * @param fileName
     */
    @Logger
    public async uploadDataToS3(
        data: T[],
        folderPath: string,
        fileName: string,
    ): Promise<void> {
        try {
            if (data.length === 0) {
                // データが空の場合は何もしない
                return;
            }
            const firstRecord = data[0] as Record<string, unknown>;
            const csvWriterUnknown = createCsvWriter({
                path: `/tmp/${fileName}`,
                header: Object.keys(firstRecord).map((key) => ({
                    id: key,
                    title: key,
                })),
            }) as unknown;

            await (
                csvWriterUnknown as {
                    writeRecords: (
                        records: Record<string, unknown>[],
                    ) => Promise<void>;
                }
            ).writeRecords(data as Record<string, unknown>[]);

            const fileContent = fs.readFileSync(`/tmp/${fileName}`);
            const params = {
                Bucket: this.bucketName,
                Key: `${folderPath}${fileName}`,
                Body: fileContent,
            };

            const command = new PutObjectCommand(params);
            await this.s3Client.send(command);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.debug(error.message);
            } else {
                console.debug(String(error));
            }
            throw new Error('ファイルのアップロードに失敗しました');
        }
    }

    /**
     * データをS3から取得する
     * @param folderPath
     * @param fileName
     */
    @Logger
    public async fetchDataFromS3(
        folderPath: string,
        fileName: string,
    ): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: `${folderPath}${fileName}`,
        };

        try {
            const command = new GetObjectCommand(params);
            const response = await this.s3Client.send(command);

            const bodyStream = response.Body as Readable;
            const chunks: Buffer[] = [];

            for await (const chunk of bodyStream) {
                chunks.push(
                    Buffer.isBuffer(chunk)
                        ? chunk
                        : Buffer.from(chunk as ArrayBuffer),
                );
            }

            return Buffer.concat(chunks).toString(); // 最後に文字列化
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.debug(error.message);
            } else {
                console.debug(String(error));
            }
            console.warn('ファイルが存在しません');
            return '';
        }
    }
}
