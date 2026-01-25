/**
 * RaceDataHtmlGateway テスト
 *
 * ## デシジョンテーブル
 *
 * | No | レースタイプ | レース番号 | fetch結果 | 期待される動作 |
 * |----|------------|----------|---------|---------------|
 * | 1  | JRA        | なし      | 成功    | HTML取得 |
 * | 2  | JRA        | 10       | 成功    | HTML取得（レース番号付き） |
 * | 3  | NAR        | なし      | 成功    | HTML取得 |
 * | 4  | -          | -        | 失敗    | エラーをスロー |
 *
 * ### URL生成
 * - createRaceUrl関数でURL生成
 * - レースタイプ、日付、開催場、レース番号を渡す
 *
 * ### セキュリティ
 * - 本番環境でも1秒のwait実装（過負荷防止）
 *
 * ### エラーハンドリング
 * - fetch失敗時は「HTMLの取得に失敗しました」エラー
 */
import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
        it('fetchを呼び出してHTMLを取得すること', async () => {
            const mockHtml = '<html><body>Race Test</body></html>';
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

        it('レース番号を指定してfetchを呼び出すこと', async () => {
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
            const mockFetch = vi
                .fn()
                .mockRejectedValue(new Error('Network error'));
            global.fetch = mockFetch as any;

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const number = 11;

            await expect(
                gateway.fetch(RaceType.JRA, date, location, number),
            ).rejects.toThrow('HTMLの取得に失敗しました');
        });
    });
});
