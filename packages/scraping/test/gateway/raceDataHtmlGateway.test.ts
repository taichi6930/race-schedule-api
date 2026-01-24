import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RaceDataHtmlGateway } from '../../src/gateway/implement/raceDataHtmlGateway';

describe('RaceDataHtmlGateway', () => {
    let gateway: RaceDataHtmlGateway;
    let originalNodeEnv: string | undefined;

    beforeEach(() => {
        gateway = new RaceDataHtmlGateway();
        originalNodeEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
        vi.restoreAllMocks();
    });

    describe('fetch', () => {
        it('開発環境では外部アクセスを禁止すること', async () => {
            process.env.NODE_ENV = 'development';

            const date = new Date(2024, 4, 26);
            const location = '東京';

            await expect(
                gateway.fetch(RaceType.JRA, date, location),
            ).rejects.toThrow(
                'ローカル環境では外部HTMLの取得はできません。R2キャッシュのみ使用してください。',
            );
        });

        it('本番環境ではfetchを呼び出すこと', async () => {
            process.env.NODE_ENV = 'production';

            const mockHtml = '<html><body>Race Test</body></html>';
            const mockFetch = vi.fn().mockResolvedValue({
                text: vi.fn().mockResolvedValue(mockHtml),
            });
            global.fetch = mockFetch as any;

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await gateway.fetch(RaceType.JRA, date, location);

            expect(result).toBe(mockHtml);
            expect(mockFetch).toHaveBeenCalled();
        });

        it('レース番号を指定してfetchを呼び出すこと', async () => {
            process.env.NODE_ENV = 'production';

            const mockHtml = '<html><body>Race 10</body></html>';
            const mockFetch = vi.fn().mockResolvedValue({
                text: vi.fn().mockResolvedValue(mockHtml),
            });
            global.fetch = mockFetch as any;

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const number = 10;
            const result = await gateway.fetch(
                RaceType.JRA,
                date,
                location,
                number,
            );

            expect(result).toBe(mockHtml);
            expect(mockFetch).toHaveBeenCalled();
        });
    });

    describe('エラーハンドリング', () => {
        it('fetch失敗時にエラーをスローすること', async () => {
            process.env.NODE_ENV = 'production';

            const mockFetch = vi
                .fn()
                .mockRejectedValue(new Error('Network error'));
            global.fetch = mockFetch as any;

            const date = new Date(2024, 4, 26);
            const location = '東京';

            await expect(
                gateway.fetch(RaceType.JRA, date, location),
            ).rejects.toThrow('HTMLの取得に失敗しました');
        });
    });
});
