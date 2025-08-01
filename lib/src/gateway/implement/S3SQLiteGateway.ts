import * as fs from 'node:fs';
import path from 'node:path';

import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

export class S3SQLiteGateway {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly dbKey: string;
    private readonly localTmpPath: string;

    public constructor(bucketName: string, dbKey: string) {
        this.s3Client = new S3Client({ region: 'ap-northeast-1' });
        this.bucketName = bucketName;
        this.dbKey = dbKey;
        this.localTmpPath = path.join('/tmp', path.basename(dbKey));
    }

    // S3からDBファイルを取得してローカルに保存
    public async fetchDbFromS3(): Promise<void> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: this.dbKey,
        });
        const response = await this.s3Client.send(command);
        const bodyStream = response.Body;
        if (!bodyStream || typeof bodyStream === 'string') {
            throw new Error('S3からDBファイルの取得に失敗しました');
        }
        const chunks: Buffer[] = [];

        for await (const chunk of bodyStream as any) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        fs.writeFileSync(this.localTmpPath, Buffer.concat(chunks));
    }

    // DB更新後にS3へアップロード
    public async uploadDbToS3(): Promise<void> {
        const dbBuffer = fs.readFileSync(this.localTmpPath);
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: this.dbKey,
            Body: dbBuffer,
        });
        await this.s3Client.send(command);
    }
}
