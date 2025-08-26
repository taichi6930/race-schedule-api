import fs from 'node:fs';

import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';

import type { ISQLiteGateway } from './interface/ISQLiteGateway';
import { downloadToFile, headObjectEtag, uploadFile } from './s3Helper';

const DEFAULT_TMP_PATH = '/tmp/db.sqlite';

@injectable()
export class SqliteS3Gateway implements ISQLiteGateway {
    private readonly dbPath: string;
    private db?: Database.Database;
    private readonly bucket: string;
    private readonly key: string;
    private etag?: string;

    public constructor(
        bucket: string,
        key: string,
        tmpPath = DEFAULT_TMP_PATH,
    ) {
        this.bucket = bucket;
        this.key = key;
        this.dbPath = tmpPath;
    }

    private ensureDbOpen(): void {
        if (this.db) return;

        if (!fs.existsSync(this.dbPath)) {
            throw new Error(
                `DB file not found at ${this.dbPath}. Call ensureDownloaded first.`,
            );
        }

        this.db = new Database(this.dbPath, { readonly: false });
    }

    public async ensureDownloaded(): Promise<void> {
        const dest = this.dbPath;
        const res = await downloadToFile(this.bucket, this.key, dest);
        this.etag = res.etag;
        // open lazily when needed
    }

    public transaction<T>(_fn: () => T): T {
        throw new Error(
            'SqliteS3Gateway does not support transaction wrapping',
        );
    }

    public run(query: string, params: unknown[] = []): void {
        try {
            this.ensureDbOpen();
            if (!this.db) throw new Error('DB not opened');
            this.db.prepare(query).run(...params);
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    public get<T>(query: string, params: unknown[] = []): T | undefined {
        try {
            this.ensureDbOpen();
            if (!this.db) throw new Error('DB not opened');
            const row = this.db.prepare(query).get(...params);
            return row as T | undefined;
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    public async all<T>(query: string, params: unknown[] = []): Promise<T[]> {
        try {
            this.ensureDbOpen();
            if (!this.db) throw new Error('DB not opened');
            const rows = this.db.prepare(query).all(...params);
            return rows as unknown as T[];
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    /**
     * Call this after performing write operations to push the DB back to S3.
     * Uses optimistic ETag check; callers may set retries if desired.
     * @param retries - number of attempt retries on conflict
     * @param backoffMs - base backoff in ms
     */
    public async pushToS3(retries = 3, backoffMs = 200): Promise<void> {
        if (!fs.existsSync(this.dbPath))
            throw new Error('DB file not found for upload');

        // close DB to flush handles
        if (this.db) {
            try {
                this.db.close();
            } catch {
                // ignore
            }
            this.db = undefined;
        }

        for (let attempt = 0; attempt <= retries; attempt += 1) {
            try {
                // recheck etag
                const current = await headObjectEtag(
                    this.bucket,
                    this.key,
                ).catch(() => undefined);
                if (this.etag && current && this.etag !== current) {
                    throw new Error('ETagMismatch');
                }
                const res = await uploadFile(
                    this.bucket,
                    this.key,
                    this.dbPath,
                    this.etag,
                ).catch((error: unknown) => {
                    throw error;
                });
                this.etag = res.etag;
                return;
            } catch (error) {
                if (attempt === retries) throw error;
                // backoff

                await new Promise((r) =>
                    setTimeout(r, backoffMs * (attempt + 1)),
                );
            }
        }
    }
}
