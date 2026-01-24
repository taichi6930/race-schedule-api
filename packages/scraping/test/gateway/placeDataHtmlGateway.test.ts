import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PlaceDataHtmlGateway } from '../../src/gateway/implement/placeDataHtmlGateway';

describe('PlaceDataHtmlGateway', () => {
    let gateway: PlaceDataHtmlGateway;
    let originalNodeEnv: string | undefined;

    beforeEach(() => {
        gateway = new PlaceDataHtmlGateway();
        originalNodeEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
        vi.restoreAllMocks();
    });

    describe('fetch', () => {
        it('開発環境では外部アクセスを禁止すること', async () => {
            process.env.NODE_ENV = 'development';

            const date = new Date(2024, 0, 1);

            await expect(gateway.fetch(RaceType.JRA, date)).rejects.toThrow(
                'ローカル環境では外部HTMLの取得はできません。R2キャッシュのみ使用してください。',
            );
        });

        it('本番環境ではfetchを呼び出すこと', async () => {
            process.env.NODE_ENV = 'production';

            const mockHtml = '<html><body>Test</body></html>';
            const mockFetch = vi.fn().mockResolvedValue({
                text: vi.fn().mockResolvedValue(mockHtml),
            });
            global.fetch = mockFetch as any;

            const date = new Date(2024, 0, 1);
            const result = await gateway.fetch(RaceType.JRA, date);

            expect(result).toBe(mockHtml);
            expect(mockFetch).toHaveBeenCalled();
        });
    });

    describe('URL生成', () => {
        it('JRAは年単位のURLを生成すること', async () => {
            process.env.NODE_ENV = 'production';

            const mockFetch = vi.fn().mockResolvedValue({
                text: vi.fn().mockResolvedValue('<html></html>'),
            });
            global.fetch = mockFetch as any;

            const date = new Date(2024, 5, 15); // 任意の月日
            await gateway.fetch(RaceType.JRA, date);

            const calledUrl = mockFetch.mock.calls[0][0];
            expect(calledUrl).toContain('2024');
        });

        it('NAR/KEIRIN等は月単位のURLを生成すること', async () => {
            process.env.NODE_ENV = 'production';

            const mockFetch = vi.fn().mockResolvedValue({
                text: vi.fn().mockResolvedValue('<html></html>'),
            });
            global.fetch = mockFetch as any;

            const date = new Date(2024, 5, 15);
            await gateway.fetch(RaceType.NAR, date);

            const calledUrl = mockFetch.mock.calls[0][0];
            // URLはクエリパラメータ形式（k_year=2024&k_month=06）
            expect(calledUrl).toContain('2024');
            expect(calledUrl).toContain('06');
        });
    });
});
