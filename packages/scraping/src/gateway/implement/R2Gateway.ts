import { injectable } from 'tsyringe';

import type { IR2Gateway } from '../interface/IR2Gateway';

interface R2Bucket {
    put: (
        key: string,
        value: string | ArrayBuffer,
        options?: any,
    ) => Promise<void>;
    get: (key: string) => Promise<{ text: () => Promise<string> } | null>;
    delete: (key: string) => Promise<void>;
}

@injectable()
export class R2Gateway implements IR2Gateway {
    private bucket?: R2Bucket;

    public setBucket(bucket: R2Bucket): void {
        this.bucket = bucket;
    }

    public async putObject(
        key: string,
        body: string | ArrayBuffer,
        contentType?: string,
    ): Promise<void> {
        if (!this.bucket) return; // キャッシュが無い場合はスキップ
        await this.bucket.put(key, body, {
            httpMetadata: {
                contentType: contentType ?? 'application/octet-stream',
            },
        });
    }

    public async getObject(key: string): Promise<string | null> {
        if (!this.bucket) return null; // キャッシュが無い場合はnull
        const obj = await this.bucket.get(key);
        if (!obj) return null;
        return obj.text();
    }

    public async deleteObject(key: string): Promise<void> {
        if (!this.bucket) return; // キャッシュが無い場合はスキップ
        await this.bucket.delete(key);
    }
}
