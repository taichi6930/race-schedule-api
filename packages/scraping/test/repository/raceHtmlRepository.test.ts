/**
 * RaceHtmlR2Repository テスト
 *
 * ## デシジョンテーブル
 *
 * | No | 操作   | レースタイプ | レース番号 | キャッシュ有無 | キャッシュ期限 | 期待される動作 |
 * |----|--------|------------|----------|--------------|-------------|---------------|
 * | 1  | fetch  | JRA        | なし      | -            | -           | Gateway呼び出し→R2保存 |
 * | 2  | fetch  | JRA        | 10        | -            | -           | Gateway呼び出し（番号指定）→R2保存 |
 * | 3  | load   | JRA        | なし      | あり         | 有効        | R2から読み込み |
 * | 4  | load   | -          | -         | なし         | -           | null返却 |
 * | 5  | load   | -          | -         | あり         | 期限切れ    | null返却（1日超過） |
 * | 6  | save   | JRA        | なし      | -            | -           | R2に保存 |
 * | 7  | save   | JRA        | 10        | -            | -           | R2に保存（番号付き） |
 *
 * ### キー生成
 * - レースタイプ、日付、開催場、レース番号からキーを生成
 * - generateCacheKeyメソッドで処理
 *
 * ### キャッシュ有効期限
 * - 1日（24時間）
 */
import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RaceHtmlR2Repository } from '../../src/repository/implement/raceHtmlRepository';

describe('RaceHtmlR2Repository', () => {
    // モックGatewayの作成
    const createMockGateways = (
        html: string = '<html></html>',
        uploaded: Date = new Date(),
    ) => ({
        r2Gateway: {
            getObjectWithMetadata: vi
                .fn()
                .mockResolvedValue({ body: html, uploaded }),
            putObject: vi.fn().mockResolvedValue(undefined),
        },
        raceDataHtmlGateway: {
            fetch: vi.fn().mockResolvedValue(html),
        },
    });

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2024, 4, 26));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('fetchRaceHtml', () => {
        it('raceDataHtmlGatewayからHTMLを取得し、R2に保存すること', async () => {
            const mockHtml = '<html><body>Race HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await repository.fetchRaceHtml(
                RaceType.JRA,
                date,
                location,
            );

            expect(result).toBe(mockHtml);
            expect(mocks.raceDataHtmlGateway.fetch).toHaveBeenCalledWith(
                RaceType.JRA,
                date,
                location,
                undefined,
            );
            expect(mocks.r2Gateway.putObject).toHaveBeenCalled();
        });

        it('レース番号を指定して取得できること', async () => {
            const mockHtml = '<html><body>Race 10 HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const number = 10;
            const result = await repository.fetchRaceHtml(
                RaceType.JRA,
                date,
                location,
                number,
            );

            expect(result).toBe(mockHtml);
            expect(mocks.raceDataHtmlGateway.fetch).toHaveBeenCalledWith(
                RaceType.JRA,
                date,
                location,
                number,
            );
        });
    });

    describe('loadRaceHtml', () => {
        it('R2からJRAのHTMLを読み込むこと', async () => {
            const mockHtml = '<html><body>Cached Race HTML</body></html>';
            // キャッシュは1時間前に保存されたもの（有効期限内）
            const uploaded = new Date(Date.now() - 1 * 60 * 60 * 1000);
            const mocks = createMockGateways(mockHtml, uploaded);
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await repository.loadRaceHtml(
                RaceType.JRA,
                date,
                location,
            );

            expect(result).toBe(mockHtml);
            expect(
                mocks.r2Gateway.getObjectWithMetadata,
            ).toHaveBeenCalled();
        });

        it('HTMLが存在しない場合はnullを返すこと', async () => {
            const mocks = createMockGateways();
            mocks.r2Gateway.getObjectWithMetadata = vi
                .fn()
                .mockResolvedValue(null);

            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await repository.loadRaceHtml(
                RaceType.JRA,
                date,
                location,
            );

            expect(result).toBeNull();
        });

        it('キャッシュが1日以上前の場合はnullを返すこと', async () => {
            const mockHtml = '<html><body>Expired Race HTML</body></html>';
            // 2日前に保存されたキャッシュ（期限切れ）
            const uploaded = new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000,
            );
            const mocks = createMockGateways(mockHtml, uploaded);
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await repository.loadRaceHtml(
                RaceType.JRA,
                date,
                location,
            );

            expect(result).toBeNull();
        });

        it('キャッシュが1日以内の場合はHTMLを返すこと', async () => {
            const mockHtml = '<html><body>Valid Race HTML</body></html>';
            // 12時間前に保存されたキャッシュ（有効期限内）
            const uploaded = new Date(
                Date.now() - 12 * 60 * 60 * 1000,
            );
            const mocks = createMockGateways(mockHtml, uploaded);
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await repository.loadRaceHtml(
                RaceType.JRA,
                date,
                location,
            );

            expect(result).toBe(mockHtml);
        });
    });

    describe('saveRaceHtml', () => {
        it('HTMLをR2に保存すること', async () => {
            const mockHtml = '<html><body>Save Race Test</body></html>';
            const mocks = createMockGateways();
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            await repository.saveRaceHtml(
                RaceType.JRA,
                date,
                mockHtml,
                location,
            );

            expect(mocks.r2Gateway.putObject).toHaveBeenCalled();
        });
    });
});
