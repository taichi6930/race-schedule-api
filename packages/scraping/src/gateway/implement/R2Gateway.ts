import { EnvStore } from '@race-schedule/shared/src/utilities/envStore';
import { injectable } from 'tsyringe';

import type { IR2Gateway } from '../interface/IR2Gateway';

interface R2Bucket {
    put: (
        key: string,
        value: string | ArrayBuffer,
        options?: any,
    ) => Promise<void>;
    get: (
        key: string,
    ) => Promise<{
        text: () => Promise<string>;
        uploaded: Date;
    } | null>;
    delete: (key: string) => Promise<void>;
}

@injectable()
export class R2Gateway implements IR2Gateway {
    /**
     * EnvStoreからR2バケットを取得
     * EnvStoreが初期化されていない、またはR2_BUCKETが存在しない場合はundefinedを返す
     */
    private getBucket(): R2Bucket | undefined {
        try {
            return EnvStore.env.R2_BUCKET as unknown as R2Bucket;
        } catch {
            // EnvStoreが初期化されていない場合
            return undefined;
        }
    }

    public async putObject(
        key: string,
        body: string | ArrayBuffer,
        contentType?: string,
    ): Promise<void> {
        const bucket = this.getBucket();
        if (!bucket) return; // キャッシュが無い場合はスキップ
        await bucket.put(key, body, {
            httpMetadata: {
                contentType: contentType ?? 'application/octet-stream',
            },
        });
    }

    public async getObject(key: string): Promise<string | null> {
        const bucket = this.getBucket();
        if (!bucket) return null; // キャッシュが無い場合はnull
        const obj = await bucket.get(key);
        if (!obj) return null;
        return obj.text();
    }

    public async getObjectWithMetadata(
        key: string,
    ): Promise<{ body: string; uploaded: Date } | null> {
        const bucket = this.getBucket();
        if (!bucket) return null;
        const obj = await bucket.get(key);
        if (!obj) return null;
        const body = await obj.text();
        return { body, uploaded: obj.uploaded };
    }

    public async deleteObject(key: string): Promise<void> {
        const bucket = this.getBucket();
        if (!bucket) return; // キャッシュが無い場合はスキップ
        await bucket.delete(key);
    }
}
