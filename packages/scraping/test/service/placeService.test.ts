/**
 * PlaceService テスト
 *
 * ## デシジョンテーブル
 *
 * | No | レースタイプ | HTMLソース | CI環境 | 期待される動作 |
 * |----|------------|-----------|--------|---------------|
 * | 1  | JRA        | モックHTML | No     | 288件のplace取得、JST 00:00:00検証 |
 * | 2  | JRA        | モックHTML | Yes    | テストスキップ |
 * | 3  | NAR        | モックHTML | No     | place配列取得、JST時刻検証 |
 * | 4  | NAR        | モックHTML | Yes    | テストスキップ |
 * | 5  | NAR        | 空HTML     | -      | 空配列、repository呼び出し検証 |
 * | 6  | KEIRIN     | モックHTML | No     | place配列取得、グレード情報検証 |
 * | 7  | KEIRIN     | モックHTML | Yes    | テストスキップ |
 * | 8  | KEIRIN     | 空HTML     | -      | 空配列、repository呼び出し検証 |
 * | 9  | AUTORACE   | モックHTML | No     | place配列取得、グレード情報検証 |
 * | 10 | AUTORACE   | モックHTML | Yes    | テストスキップ |
 * | 11 | AUTORACE   | 空HTML     | -      | 空配列、repository呼び出し検証 |
 * | 12 | OVERSEAS   | 空HTML     | -      | 空配列、repository呼び出し検証 |
 * | 13 | BOATRACE   | 空HTML     | -      | 空配列、repository呼び出し検証 |
 * | 14 | キャッシュ  | あり       | -      | fetchPlaceHtml未呼び出し |
 * | 15 | キャッシュ  | なし       | -      | fetchPlaceHtml呼び出し |
 */
import { RaceType } from '@race-schedule/shared/src/types/raceType';
import {
    formatJstDate,
    getJstHours,
    getJstMinutes,
    getJstSeconds,
} from '@race-schedule/shared/src/utilities/dateJst';
import { readFileSync } from 'fs';
import { join } from 'path';
import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';

import { PlaceService } from '../../src/service/placeService';

describe('PlaceService', () => {
    // モックHTMLファイルのパス（プロジェクトルートからの相対パス）
    const mockHtmlBasePath = join(
        __dirname,
        '../../../..',
        'src/gateway/mockData/html',
    );

    // モックリポジトリの作成
    const createMockRepository = (html: string) => ({
        loadPlaceHtml: vi.fn().mockResolvedValue(html),
        fetchPlaceHtml: vi.fn().mockResolvedValue(html),
        savePlaceHtml: vi.fn().mockResolvedValue(undefined),
    });

    describe('JRA Place parsing', () => {
        it.skipIf(process.env.CI === 'true')(
            'JRA 2024年の開催場データを正しくパースできること',
            async () => {
                // モックHTMLを読み込み
                const jraHtml = readFileSync(
                    join(mockHtmlBasePath, 'jra/place/2024.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(jraHtml);
                const service = new PlaceService(mockRepository as any);

                const date = new Date(2024, 0, 1);
                const result = await service.fetch(RaceType.JRA, date);

                // 結果の検証
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                console.log(
                    result.map((r) => ({
                        ...r,
                        datetime: formatJstDate(r.datetime),
                    })),
                );
                expect(result.length).toBe(288);

                // 最初の要素の構造を検証
                const firstPlace = result[0];
                expect(firstPlace).toHaveProperty('raceType');
                expect(firstPlace).toHaveProperty('datetime');
                expect(firstPlace).toHaveProperty('placeName');
                expect(firstPlace.raceType).toBe(RaceType.JRA);
                expect(firstPlace.datetime).toBeInstanceOf(Date);
                expect(typeof firstPlace.placeName).toBe('string');

                // 日付の時刻部分がJST 00:00:00であることを確認
                expect(getJstHours(firstPlace.datetime)).toBe(0);
                expect(getJstMinutes(firstPlace.datetime)).toBe(0);
                expect(getJstSeconds(firstPlace.datetime)).toBe(0);

                // 競馬場名が正しいことを検証
                const placeNames = result.map((p) => p.placeName);
                const expectedPlaces = [
                    '札幌',
                    '函館',
                    '福島',
                    '新潟',
                    '東京',
                    '中山',
                    '中京',
                    '京都',
                    '阪神',
                    '小倉',
                ];
                const hasValidPlaces = placeNames.some((name) =>
                    expectedPlaces.includes(name),
                );
                expect(hasValidPlaces).toBe(true);
            },
        );

        it.skipIf(process.env.CI === 'true')(
            'JRA 2023年の開催場データを正しくパースできること',
            async () => {
                const jraHtml = readFileSync(
                    join(mockHtmlBasePath, 'jra/place/2023.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(jraHtml);
                const service = new PlaceService(mockRepository as any);

                const date = new Date(2023, 0, 1);
                const result = await service.fetch(RaceType.JRA, date);

                expect(result.length).toBeGreaterThan(0);
                expect(result[0].raceType).toBe(RaceType.JRA);
            },
        );
    });

    describe('NAR Place parsing', () => {
        it.skipIf(process.env.CI === 'true')(
            'NAR 2020年1月の開催場データを正しくパースできること',
            async () => {
                const narHtml = readFileSync(
                    join(mockHtmlBasePath, 'nar/place/202001.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(narHtml);
                const service = new PlaceService(mockRepository as any);

                const date = new Date(2020, 0, 1);
                const result = await service.fetch(RaceType.NAR, date);

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);

                const firstPlace = result[0];
                expect(firstPlace.raceType).toBe(RaceType.NAR);
                expect(firstPlace.datetime).toBeInstanceOf(Date);
                expect(typeof firstPlace.placeName).toBe('string');

                // 日付の時刻部分がJST 00:00:00であることを確認
                expect(getJstHours(firstPlace.datetime)).toBe(0);
                expect(getJstMinutes(firstPlace.datetime)).toBe(0);
                expect(getJstSeconds(firstPlace.datetime)).toBe(0);
            },
        );

        it('NAR開催場データのパース処理が呼ばれること', async () => {
            // シンプルなHTMLでテスト（parseNarメソッドが呼ばれることを確認）
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new PlaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const result = await service.fetch(RaceType.NAR, date);

            // 結果が配列であることを確認
            expect(Array.isArray(result)).toBe(true);
            // loadPlaceHtmlが呼ばれたことを確認
            expect(mockRepository.loadPlaceHtml).toHaveBeenCalledWith(
                RaceType.NAR,
                date,
            );
        });
    });

    describe('OVERSEAS Place parsing', () => {
        it('OVERSEAS開催場データのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new PlaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const result = await service.fetch(RaceType.OVERSEAS, date);

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadPlaceHtml).toHaveBeenCalledWith(
                RaceType.OVERSEAS,
                date,
            );
        });
    });

    describe('KEIRIN Place parsing', () => {
        it.skipIf(process.env.CI === 'true')(
            'KEIRIN 2020年1月の開催場データを正しくパースできること',
            async () => {
                const keirinHtml = readFileSync(
                    join(mockHtmlBasePath, 'keirin/place/202001.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(keirinHtml);
                const service = new PlaceService(mockRepository as any);

                const date = new Date(2020, 0, 1);
                const result = await service.fetch(RaceType.KEIRIN, date);

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);

                const firstPlace = result[0];
                expect(firstPlace.raceType).toBe(RaceType.KEIRIN);
                expect(firstPlace.datetime).toBeInstanceOf(Date);
                expect(typeof firstPlace.placeName).toBe('string');
                // KEIRINはグレード情報が場所名に含まれる（例: 場所名GⅠ）
                expect(firstPlace.placeName.length).toBeGreaterThan(0);
            },
        );

        it('KEIRIN開催場データのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new PlaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const result = await service.fetch(RaceType.KEIRIN, date);

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadPlaceHtml).toHaveBeenCalledWith(
                RaceType.KEIRIN,
                date,
            );
        });
    });

    describe('AUTORACE Place parsing', () => {
        it.skipIf(process.env.CI === 'true')(
            'AUTORACE 2024年11月の開催場データを正しくパースできること',
            async () => {
                const autoraceHtml = readFileSync(
                    join(mockHtmlBasePath, 'autorace/place/202411.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(autoraceHtml);
                const service = new PlaceService(mockRepository as any);

                const date = new Date(2024, 10, 1);
                const result = await service.fetch(RaceType.AUTORACE, date);

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);

                const firstPlace = result[0];
                expect(firstPlace.raceType).toBe(RaceType.AUTORACE);
                expect(firstPlace.datetime).toBeInstanceOf(Date);
                expect(typeof firstPlace.placeName).toBe('string');
                // AUTORACEはグレード情報が場所名に含まれる（例: 場所名SG）
                expect(firstPlace.placeName.length).toBeGreaterThan(0);
            },
        );

        it('AUTORACE開催場データのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new PlaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const result = await service.fetch(RaceType.AUTORACE, date);

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadPlaceHtml).toHaveBeenCalledWith(
                RaceType.AUTORACE,
                date,
            );
        });
    });

    describe('BOATRACE Place parsing', () => {
        it('BOATRACE開催場データのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new PlaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const result = await service.fetch(RaceType.BOATRACE, date);

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadPlaceHtml).toHaveBeenCalledWith(
                RaceType.BOATRACE,
                date,
            );
        });
    });

    describe('Cache handling', () => {
        it('loadPlaceHtmlがnullを返した場合、fetchPlaceHtmlが呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = {
                loadPlaceHtml: vi.fn().mockResolvedValue(null),
                fetchPlaceHtml: vi.fn().mockResolvedValue(mockHtml),
                savePlaceHtml: vi.fn().mockResolvedValue(undefined),
            };

            const service = new PlaceService(mockRepository as any);
            const date = new Date(2024, 0, 1);
            await service.fetch(RaceType.JRA, date);

            expect(mockRepository.loadPlaceHtml).toHaveBeenCalled();
            expect(mockRepository.fetchPlaceHtml).toHaveBeenCalled();
        });

        it('loadPlaceHtmlがHTMLを返した場合、fetchPlaceHtmlが呼ばれないこと', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = {
                loadPlaceHtml: vi.fn().mockResolvedValue(mockHtml),
                fetchPlaceHtml: vi.fn().mockResolvedValue(mockHtml),
                savePlaceHtml: vi.fn().mockResolvedValue(undefined),
            };

            const service = new PlaceService(mockRepository as any);
            const date = new Date(2024, 0, 1);
            await service.fetch(RaceType.JRA, date);

            expect(mockRepository.loadPlaceHtml).toHaveBeenCalled();
            expect(mockRepository.fetchPlaceHtml).not.toHaveBeenCalled();
        });
    });
});
