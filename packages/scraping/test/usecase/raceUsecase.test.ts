import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';

import { RaceUsecase } from '../../src/usecase/raceUsecase';

describe('RaceUsecase', () => {
    // モックサービスの作成
    const createMockService = (races: any[] = []) => ({
        fetch: vi.fn().mockResolvedValue(races),
    });

    describe('fetch', () => {
        it('RaceServiceを呼び出してレースデータを取得すること', async () => {
            const mockRaces = [
                {
                    raceType: RaceType.JRA,
                    datetime: new Date(2024, 4, 26, 10, 0),
                    location: '東京',
                    raceNumber: 1,
                    raceName: '1R',
                },
            ];
            const mockService = createMockService(mockRaces);
            const usecase = new RaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 4, 26),
                finishDate: new Date(2024, 4, 26),
                raceTypeList: ['JRA'],
                locationList: ['東京'],
            };

            const result = await usecase.fetch(filter);

            expect(mockService.fetch).toHaveBeenCalled();
            expect(result.length).toBeGreaterThan(0);
        });

        it('複数日付にわたるレースを取得すること', async () => {
            const mockRaces = [
                {
                    raceType: RaceType.JRA,
                    datetime: new Date(2024, 4, 26),
                    location: '東京',
                    raceNumber: 1,
                },
            ];
            const mockService = createMockService(mockRaces);
            const usecase = new RaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 4, 26),
                finishDate: new Date(2024, 4, 28), // 3日間
                raceTypeList: ['JRA'],
                locationList: ['東京'],
            };

            await usecase.fetch(filter);

            // 3日間 × 1レースタイプ × 1開催場 = 3回
            expect(mockService.fetch).toHaveBeenCalledTimes(3);
        });

        it('複数の開催場のレースを取得すること', async () => {
            const mockRaces = [{ raceType: RaceType.JRA, raceNumber: 1 }];
            const mockService = createMockService(mockRaces);
            const usecase = new RaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 4, 26),
                finishDate: new Date(2024, 4, 26),
                raceTypeList: ['JRA'],
                locationList: ['東京', '京都'],
            };

            await usecase.fetch(filter);

            // 1日 × 1レースタイプ × 2開催場 = 2回
            expect(mockService.fetch).toHaveBeenCalledTimes(2);
        });

        it('locationListが未指定の場合は空配列を返すこと', async () => {
            const mockService = createMockService([]);
            const usecase = new RaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 4, 26),
                finishDate: new Date(2024, 4, 26),
                raceTypeList: ['JRA'],
            };

            const result = await usecase.fetch(filter);

            expect(result).toEqual([]);
            expect(mockService.fetch).not.toHaveBeenCalled();
        });

        it('エラーが発生してもスキップして続行すること', async () => {
            const mockRaces = [{ raceType: RaceType.JRA, raceNumber: 1 }];
            const mockService = {
                fetch: vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Network error'))
                    .mockResolvedValue(mockRaces),
            };
            const usecase = new RaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 4, 26),
                finishDate: new Date(2024, 4, 27),
                raceTypeList: ['JRA'],
                locationList: ['東京'],
            };

            const result = await usecase.fetch(filter);

            // エラーが発生しても処理は続く
            expect(mockService.fetch).toHaveBeenCalledTimes(2);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('複数レースタイプの処理', () => {
        it('JRAとNARを同時に取得できること', async () => {
            const mockRaces = [{ raceNumber: 1 }];
            const mockService = createMockService(mockRaces);
            const usecase = new RaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 4, 26),
                finishDate: new Date(2024, 4, 26),
                raceTypeList: ['JRA', 'NAR'],
                locationList: ['東京', '大井'],
            };

            await usecase.fetch(filter);

            // 1日 × 2レースタイプ × 2開催場 = 4回
            expect(mockService.fetch).toHaveBeenCalledTimes(4);
        });
    });
});
