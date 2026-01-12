import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import type { CloudFlareEnv } from '@race-schedule/shared/src/utilities/cloudFlareEnv';
import { injectable } from 'tsyringe';

import type { IR2Gateway } from '../interface/IR2Gateway';

@injectable()
export class R2Gateway implements IR2Gateway {
    private readonly client: S3Client;

    public constructor(env: CloudFlareEnv) {
        this.client = new S3Client({
            endpoint: env.R2_ENDPOINT,
            region: 'auto',
            credentials: {
                accessKeyId: env.R2_ACCESS_KEY_ID,
                secretAccessKey: env.R2_SECRET_ACCESS_KEY,
            },
        });
    }

    public async putObject(
        bucket: string,
        key: string,
        body: Buffer | string,
        contentType?: string,
    ): Promise<void> {
        await this.client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: contentType ?? 'application/octet-stream',
            }),
        );
    }

    public async getObject(
        bucket: string,
        key: string,
    ): Promise<Buffer | null> {
        const res = await this.client.send(
            new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            }),
        );
        if (!res.Body) return null;
        // Node.js v18+ ReadableStream対応
        if (typeof res.Body === 'string') return Buffer.from(res.Body);
        if (res.Body instanceof Uint8Array) return Buffer.from(res.Body);
        // Streamの場合
        const chunks: Buffer[] = [];
        for await (const chunk of res.Body as any) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
    }

    public async deleteObject(bucket: string, key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            }),
        );
    }
}
