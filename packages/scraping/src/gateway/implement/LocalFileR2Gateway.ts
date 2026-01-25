import fs from 'node:fs/promises';
import path from 'node:path';

import { injectable } from 'tsyringe';

import type { IR2Gateway } from '../interface/IR2Gateway';

/**
 * ローカル開発環境用のR2Gateway実装
 * ファイルシステムを使ってR2の代わりにローカルに保存
 */
@injectable()
export class LocalFileR2Gateway implements IR2Gateway {
    private readonly baseDir = path.resolve(process.cwd(), 'local_r2');

    /**
     * ファイルパスを取得
     */
    private getFilePath(key: string): string {
        return path.join(this.baseDir, key);
    }

    /**
     * ディレクトリを作成
     */
    private async ensureDir(filePath: string): Promise<void> {
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
    }

    public async putObject(
        key: string,
        body: string | ArrayBuffer,
        contentType?: string,
    ): Promise<void> {
        const filePath = this.getFilePath(key);
        await this.ensureDir(filePath);

        await (body instanceof ArrayBuffer
            ? fs.writeFile(filePath, Buffer.from(body))
            : fs.writeFile(filePath, body, 'utf8'));

        // メタデータも保存（オプション）
        if (contentType) {
            await fs.writeFile(
                `${filePath}.meta`,
                JSON.stringify({ contentType }),
                'utf8',
            );
        }
    }

    public async getObject(key: string): Promise<string | null> {
        const filePath = this.getFilePath(key);
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return content;
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }

    public async deleteObject(key: string): Promise<void> {
        const filePath = this.getFilePath(key);
        try {
            await fs.unlink(filePath);
            // メタデータも削除
            try {
                await fs.unlink(`${filePath}.meta`);
            } catch {
                // メタデータがない場合は無視
            }
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
}
