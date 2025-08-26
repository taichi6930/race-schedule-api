import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import {
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

export interface DownloadResult {
    etag?: string;
}

export async function downloadToFile(
    bucket: string,
    key: string,
    destPath: string,
): Promise<DownloadResult> {
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const res = await s3Client.send(cmd);

    if (!res.Body) {
        throw new Error('S3 object has no body');
    }

    await fs.mkdir(path.dirname(destPath), { recursive: true });

    // res.Body is a Readable stream in Node.js
    // Use pipeline to write to file
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyStream: any = res.Body;
    const { createWriteStream } = await import('node:fs');
    const writeStream = createWriteStream(destPath);
    await pipeline(bodyStream, writeStream);

    return { etag: res.ETag };
}

export async function headObjectEtag(
    bucket: string,
    key: string,
): Promise<string | undefined> {
    const cmd = new HeadObjectCommand({ Bucket: bucket, Key: key });
    const res = await s3Client.send(cmd);
    return res.ETag;
}

export async function uploadFile(
    bucket: string,
    key: string,
    srcPath: string,
    expectedEtag?: string,
): Promise<{ etag?: string }> {
    // If expectedEtag provided, check head first (best-effort optimistic lock)
    if (expectedEtag) {
        const current = await headObjectEtag(bucket, key).catch(
            () => undefined,
        );
        if (current && expectedEtag !== current) {
            throw new Error('ETagMismatch');
        }
    }

    const body = await fs.readFile(srcPath);
    const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body });
    const res = await s3Client.send(cmd);
    return { etag: res.ETag };
}
