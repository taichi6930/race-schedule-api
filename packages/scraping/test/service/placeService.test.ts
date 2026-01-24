import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { readFileSync } from 'fs';
import { join } from 'path';
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
        it('JRA 2024年の開催場データを正しくパースできること', async () => {
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
            expect(result.length).toBeGreaterThan(0);

            // 最初の要素の構造を検証
            const firstPlace = result[0];
            expect(firstPlace).toHaveProperty('raceType');
            expect(firstPlace).toHaveProperty('datetime');
            expect(firstPlace).toHaveProperty('placeName');
            expect(firstPlace.raceType).toBe(RaceType.JRA);
            expect(firstPlace.datetime).toBeInstanceOf(Date);
            expect(typeof firstPlace.placeName).toBe('string');

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
        });

        it('JRA 2023年の開催場データを正しくパースできること', async () => {
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
        });
    });

    describe('NAR Place parsing', () => {
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
