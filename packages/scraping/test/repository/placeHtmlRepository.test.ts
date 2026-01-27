/**
 * PlaceHtmlR2Repository テスト
 *
 * ## デシジョンテーブル
 *
 * | No | 操作          | レースタイプ | キャッシュ有無 | キャッシュ期限 | 期待される動作 |
 * |----|--------------|------------|--------------|-------------|---------------|
 * | 1  | fetch        | JRA        | -            | -           | Gateway呼び出し→R2保存 |
 * | 2  | fetch        | NAR/他     | -            | -           | Gateway呼び出し→R2保存 |
 * | 3  | load         | JRA        | あり         | 有効        | R2から読み込み（年単位キー） |
 * | 4  | load         | NAR/他     | あり         | 有効        | R2から読み込み（月単位キー） |
 * | 5  | load         | -          | なし         | -           | null返却 |
 * | 6  | load         | -          | あり         | 期限切れ    | null返却（1週間超過） |
 * | 7  | save         | JRA        | -            | -           | R2に保存（年単位キー） |
 * | 8  | save         | NAR/他     | -            | -           | R2に保存（月単位キー） |
 *
 * ### キー生成ルール
 * - JRA: `place/JRA{year}.html` (例: place/JRA2024.html)
 * - その他: `place/{raceType}{yyyyMM}.html` (例: place/NAR202406.html)
 *
 * ### キャッシュ有効期限
 * - 1週間（7日間）
 */
import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PlaceHtmlR2Repository } from '../../src/repository/implement/placeHtmlRepository';

describe('PlaceHtmlR2Repository', () => {
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
        placeDataHtmlGateway: {
            fetch: vi.fn().mockResolvedValue(html),
        },
    });

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2024, 0, 15));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('fetchPlaceHtml', () => {
        it('placeDataHtmlGatewayからHTMLを取得し、R2に保存すること', async () => {
            const mockHtml = '<html><body>Test HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            const result = await repository.fetchPlaceHtml(RaceType.JRA, date);

            expect(result).toBe(mockHtml);
            expect(mocks.placeDataHtmlGateway.fetch).toHaveBeenCalledWith(
                RaceType.JRA,
                date,
            );
            expect(mocks.r2Gateway.putObject).toHaveBeenCalled();
        });

        it('NAR/KEIRIN/AUTORACE等のレースタイプでも正しく動作すること', async () => {
            const mockHtml = '<html><body>NAR HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 5, 1);
            const result = await repository.fetchPlaceHtml(RaceType.NAR, date);

            expect(result).toBe(mockHtml);
            expect(mocks.placeDataHtmlGateway.fetch).toHaveBeenCalledWith(
                RaceType.NAR,
                date,
            );
        });
    });

    describe('loadPlaceHtml', () => {
        it('R2からJRAのHTMLを読み込むこと（年単位）', async () => {
            const mockHtml = '<html><body>Cached HTML</body></html>';
            // キャッシュは1時間前に保存されたもの（有効期限内）
            const uploaded = new Date(Date.now() - 1 * 60 * 60 * 1000);
            const mocks = createMockGateways(mockHtml, uploaded);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            const result = await repository.loadPlaceHtml(RaceType.JRA, date);

            expect(result).toBe(mockHtml);
            expect(
                mocks.r2Gateway.getObjectWithMetadata,
            ).toHaveBeenCalledWith('place/JRA2024.html');
        });

        it('R2からNARのHTMLを読み込むこと（月単位）', async () => {
            const mockHtml = '<html><body>NAR Cached HTML</body></html>';
            const uploaded = new Date(Date.now() - 1 * 60 * 60 * 1000);
            const mocks = createMockGateways(mockHtml, uploaded);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 5, 1);
            const result = await repository.loadPlaceHtml(RaceType.NAR, date);

            expect(result).toBe(mockHtml);
            expect(
                mocks.r2Gateway.getObjectWithMetadata,
            ).toHaveBeenCalledWith('place/NAR202406.html');
        });

        it('HTMLが存在しない場合はnullを返すこと', async () => {
            const mocks = createMockGateways();
            mocks.r2Gateway.getObjectWithMetadata = vi
                .fn()
                .mockResolvedValue(null);

            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            const result = await repository.loadPlaceHtml(RaceType.JRA, date);

            expect(result).toBeNull();
        });

        it('キャッシュが1週間以上前の場合はnullを返すこと', async () => {
            const mockHtml = '<html><body>Expired HTML</body></html>';
            // 8日前に保存されたキャッシュ（期限切れ）
            const uploaded = new Date(
                Date.now() - 8 * 24 * 60 * 60 * 1000,
            );
            const mocks = createMockGateways(mockHtml, uploaded);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            const result = await repository.loadPlaceHtml(RaceType.JRA, date);

            expect(result).toBeNull();
        });

        it('キャッシュが1週間以内の場合はHTMLを返すこと', async () => {
            const mockHtml = '<html><body>Valid HTML</body></html>';
            // 6日前に保存されたキャッシュ（有効期限内）
            const uploaded = new Date(
                Date.now() - 6 * 24 * 60 * 60 * 1000,
            );
            const mocks = createMockGateways(mockHtml, uploaded);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            const result = await repository.loadPlaceHtml(RaceType.JRA, date);

            expect(result).toBe(mockHtml);
        });
    });

    describe('savePlaceHtml', () => {
        it('HTMLをR2に保存すること', async () => {
            const mockHtml = '<html><body>Save Test</body></html>';
            const mocks = createMockGateways();
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            await repository.savePlaceHtml(RaceType.JRA, date, mockHtml);

            expect(mocks.r2Gateway.putObject).toHaveBeenCalledWith(
                'place/JRA2024.html',
                mockHtml,
                'text/html',
            );
        });
    });
});
