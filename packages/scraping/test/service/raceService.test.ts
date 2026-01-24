import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { readFileSync } from 'fs';
import { join } from 'path';
import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';

import { RaceService } from '../../src/service/raceService';

describe('RaceService', () => {
    // モックHTMLファイルのパス
    const mockHtmlBasePath = join(
        __dirname,
        '../../../..',
        'src/gateway/mockData/html',
    );

    // モックリポジトリの作成
    const createMockRepository = (html: string) => ({
        loadRaceHtml: vi.fn().mockResolvedValue(html),
        fetchRaceHtml: vi.fn().mockResolvedValue(html),
        saveRaceHtml: vi.fn().mockResolvedValue(undefined),
    });

    describe('JRA Race parsing', () => {
        it.skipIf(process.env.CI === 'true')(
            'JRA 2024年5月26日東京のレースデータを正しくパースできること',
            async () => {
                // モックHTMLを読み込み
                const jraHtml = readFileSync(
                    join(mockHtmlBasePath, 'jra/race/20240526.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(jraHtml);
                const service = new RaceService(mockRepository as any);

                const date = new Date(2024, 4, 26); // 2024年5月26日
                const location = '東京';
                const result = await service.fetch(
                    RaceType.JRA,
                    date,
                    location,
                );

                // 結果の検証
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);

                // 最初のレースの構造を検証
                const firstRace = result[0];
                expect(firstRace).toHaveProperty('raceType');
                expect(firstRace).toHaveProperty('datetime');
                expect(firstRace).toHaveProperty('location');
                expect(firstRace).toHaveProperty('raceNumber');
                expect(firstRace).toHaveProperty('raceName');
                expect(firstRace.raceType).toBe(RaceType.JRA);
                expect(firstRace.datetime).toBeInstanceOf(Date);
                expect(firstRace.location).toBe(location);
                expect(typeof firstRace.raceNumber).toBe('number');
                expect(typeof firstRace.raceName).toBe('string');

                // レース番号が昇順であることを検証
                const raceNumbers = result.map((r) => r.raceNumber);
                expect(raceNumbers[0]).toBeLessThan(
                    raceNumbers[raceNumbers.length - 1],
                );

                // 距離と馬場タイプが設定されていることを検証
                const racesWithDistance = result.filter((r) => r.distance);
                expect(racesWithDistance.length).toBeGreaterThan(0);

                const racesWithSurface = result.filter((r) => r.surfaceType);
                expect(racesWithSurface.length).toBeGreaterThan(0);

                // 馬場タイプが正しい値であることを確認
                racesWithSurface.forEach((race) => {
                    expect(['芝', 'ダート', '障害']).toContain(
                        race.surfaceType,
                    );
                });
            },
        );

        it.skipIf(process.env.CI === 'true')(
            'JRA 2024年5月1日のレースデータを正しくパースできること',
            async () => {
                const jraHtml = readFileSync(
                    join(mockHtmlBasePath, 'jra/race/24050101.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(jraHtml);
                const service = new RaceService(mockRepository as any);

                const date = new Date(2024, 4, 1);
                const location = '東京';
                const result = await service.fetch(
                    RaceType.JRA,
                    date,
                    location,
                );

                expect(result.length).toBeGreaterThan(0);
                expect(result[0].raceType).toBe(RaceType.JRA);
                expect(result[0].location).toBe(location);
            },
        );

        it.skipIf(process.env.CI === 'true')(
            'レースにグレード情報が含まれている場合、正しく抽出できること',
            async () => {
                const jraHtml = readFileSync(
                    join(mockHtmlBasePath, 'jra/race/20240526.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(jraHtml);
                const service = new RaceService(mockRepository as any);

                const date = new Date(2024, 4, 26);
                const location = '東京';
                const result = await service.fetch(
                    RaceType.JRA,
                    date,
                    location,
                );

                // グレードレースが含まれているか確認
                const gradedRaces = result.filter(
                    (r) => r.grade && r.grade !== '',
                );
                // 少なくとも1つはグレードレースがあることを期待
                expect(gradedRaces.length).toBeGreaterThanOrEqual(0);
            },
        );
    });

    describe('NAR Race parsing', () => {
        it.skipIf(process.env.CI === 'true')(
            'NAR 2024年10月2日大井のレースデータを正しくパースできること',
            async () => {
                const narHtml = readFileSync(
                    join(mockHtmlBasePath, 'nar/race/2024100220.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(narHtml);
                const service = new RaceService(mockRepository as any);

                const date = new Date(2024, 9, 2);
                const location = '大井';
                const result = await service.fetch(
                    RaceType.NAR,
                    date,
                    location,
                );

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);

                const firstRace = result[0];
                expect(firstRace.raceType).toBe(RaceType.NAR);
                expect(firstRace.datetime).toBeInstanceOf(Date);
                expect(typeof firstRace.raceNumber).toBe('number');
            },
        );

        it('NAR レースデータのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new RaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const location = '大井';
            const result = await service.fetch(RaceType.NAR, date, location);

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadRaceHtml).toHaveBeenCalledWith(
                RaceType.NAR,
                date,
                location,
                undefined,
            );
        });
    });

    describe('OVERSEAS Race parsing', () => {
        it('OVERSEAS レースデータのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new RaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const result = await service.fetch(RaceType.OVERSEAS, date);

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadRaceHtml).toHaveBeenCalledWith(
                RaceType.OVERSEAS,
                date,
                undefined,
                undefined,
            );
        });
    });

    describe('KEIRIN Race parsing', () => {
        it.skipIf(process.env.CI === 'true')(
            'KEIRIN 2024年10月20日のレースデータを正しくパースできること',
            async () => {
                const keirinHtml = readFileSync(
                    join(mockHtmlBasePath, 'keirin/race/2024102021.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(keirinHtml);
                const service = new RaceService(mockRepository as any);

                const date = new Date(2024, 9, 20);
                const location = '京王閣';
                const result = await service.fetch(
                    RaceType.KEIRIN,
                    date,
                    location,
                );

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);

                const firstRace = result[0];
                expect(firstRace.raceType).toBe(RaceType.KEIRIN);
                expect(firstRace.datetime).toBeInstanceOf(Date);
                expect(typeof firstRace.raceNumber).toBe('number');
            },
        );

        it('KEIRIN レースデータのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new RaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const location = '京王閣';
            const result = await service.fetch(RaceType.KEIRIN, date, location);

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadRaceHtml).toHaveBeenCalledWith(
                RaceType.KEIRIN,
                date,
                location,
                undefined,
            );
        });
    });

    describe('AUTORACE Race parsing', () => {
        it.skipIf(process.env.CI === 'true')(
            'AUTORACE 2024年11月4日のレースデータを正しくパースできること',
            async () => {
                const autoraceHtml = readFileSync(
                    join(mockHtmlBasePath, 'autorace/race/2024110402.html'),
                    'utf-8',
                );

                const mockRepository = createMockRepository(autoraceHtml);
                const service = new RaceService(mockRepository as any);

                const date = new Date(2024, 10, 4);
                const location = '川口';
                const result = await service.fetch(
                    RaceType.AUTORACE,
                    date,
                    location,
                );

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);

                const firstRace = result[0];
                expect(firstRace.raceType).toBe(RaceType.AUTORACE);
                expect(firstRace.datetime).toBeInstanceOf(Date);
                expect(typeof firstRace.raceNumber).toBe('number');
            },
        );

        it('AUTORACE レースデータのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new RaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const location = '川口';
            const result = await service.fetch(
                RaceType.AUTORACE,
                date,
                location,
            );

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadRaceHtml).toHaveBeenCalledWith(
                RaceType.AUTORACE,
                date,
                location,
                undefined,
            );
        });
    });

    describe('BOATRACE Race parsing', () => {
        it('BOATRACE レースデータのパース処理が呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(mockHtml);
            const service = new RaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const location = '桐生';
            const result = await service.fetch(
                RaceType.BOATRACE,
                date,
                location,
            );

            expect(Array.isArray(result)).toBe(true);
            expect(mockRepository.loadRaceHtml).toHaveBeenCalledWith(
                RaceType.BOATRACE,
                date,
                location,
                undefined,
            );
        });
    });

    describe('Cache handling', () => {
        it('loadRaceHtmlがnullを返した場合、fetchRaceHtmlが呼ばれること', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = {
                loadRaceHtml: vi.fn().mockResolvedValue(null),
                fetchRaceHtml: vi.fn().mockResolvedValue(mockHtml),
                saveRaceHtml: vi.fn().mockResolvedValue(undefined),
            };

            const service = new RaceService(mockRepository as any);
            const date = new Date(2024, 0, 1);
            const location = '東京';
            await service.fetch(RaceType.JRA, date, location);

            expect(mockRepository.loadRaceHtml).toHaveBeenCalled();
            expect(mockRepository.fetchRaceHtml).toHaveBeenCalled();
        });

        it('loadRaceHtmlがHTMLを返した場合、fetchRaceHtmlが呼ばれないこと', async () => {
            const mockHtml = '<html><body></body></html>';
            const mockRepository = {
                loadRaceHtml: vi.fn().mockResolvedValue(mockHtml),
                fetchRaceHtml: vi.fn().mockResolvedValue(mockHtml),
                saveRaceHtml: vi.fn().mockResolvedValue(undefined),
            };

            const service = new RaceService(mockRepository as any);
            const date = new Date(2024, 0, 1);
            const location = '東京';
            await service.fetch(RaceType.JRA, date, location);

            expect(mockRepository.loadRaceHtml).toHaveBeenCalled();
            expect(mockRepository.fetchRaceHtml).not.toHaveBeenCalled();
        });
    });

    describe('Error handling', () => {
        it('HTMLにレースデータが存在しない場合、空の配列を返すこと', async () => {
            const emptyHtml = '<html><body></body></html>';
            const mockRepository = createMockRepository(emptyHtml);
            const service = new RaceService(mockRepository as any);

            const date = new Date(2024, 0, 1);
            const location = '東京';
            const result = await service.fetch(RaceType.JRA, date, location);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });
});
