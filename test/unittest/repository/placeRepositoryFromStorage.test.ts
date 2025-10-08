import 'reflect-metadata';

import { HeldDayData } from '../../../src/domain/heldDayData';
import { SearchPlaceFilterEntity } from '../../../src/repository/entity/filter/searchPlaceFilterEntity';
import { PlaceRepositoryFromStorage } from '../../../src/repository/implement/placeRepositoryFromStorage';
import { RaceType } from '../../../src/utility/raceType';
import { testRaceTypeListAll } from '../src/mock/common/baseCommonData';

// Minimal mocks/stubs for CommonParameter and DB Gateway
describe('PlaceRepositoryFromStorage', () => {
    describe('fetchPlaceEntityList', () => {
        test('raceTypeが空の時は空配列を返す', async () => {
            const mockDb: any = {
                queryAll: jest.fn(),
            };
            const repo = new PlaceRepositoryFromStorage(mockDb);
            const filter = new SearchPlaceFilterEntity(
                new Date(),
                new Date(),
                [],
                [],
            );
            const res = await repo.fetchPlaceEntityList(filter);
            expect(res).toEqual([]);
            expect(mockDb.queryAll).not.toHaveBeenCalled();
        });

        test('DBからのデータ取得が正常に行われること', async () => {
            const rows = [
                {
                    id: 'jra2025010105',
                    race_type: RaceType.JRA,
                    date_time: '2025-01-01 00:00:00',
                    location_name: '東京',
                    held_times: 1,
                    held_day_times: 1,
                    grade: null,
                    created_at: '2024-01-01 00:00:00',
                    updated_at: '2024-01-01 00:00:00',
                },
                {
                    id: 'jra2025010105',
                    race_type: RaceType.JRA,
                    date_time: '2025-01-01 00:00:00',
                    location_name: '東京',
                    held_times: 1,
                    held_day_times: 1,
                    grade: 'GⅠ',
                    created_at: '2024-01-01 00:00:00',
                    updated_at: '2024-01-01 00:00:00',
                },
            ];
            const mockDb: any = {
                queryAll: jest.fn().mockResolvedValue({ results: rows }),
            };
            const repo = new PlaceRepositoryFromStorage(mockDb);
            const filter = new SearchPlaceFilterEntity(
                new Date('2025-01-01'),
                new Date('2025-01-02'),
                testRaceTypeListAll,
                [],
            );
            const res = await repo.fetchPlaceEntityList(filter);
            expect(res.length).toBe(1);
            for (const e of res) {
                expect(e.id).toBe('jra2025010105');
                expect(e.placeData.location).toBe('東京');
                expect(e.heldDayData).toStrictEqual(HeldDayData.create(1, 1));
                // gradeは呼び出す時点でエラーになることを確認
                if (e.placeData.raceType !== RaceType.JRA) {
                    expect(e.grade).toThrow();
                }
            }
        });
    });
});
