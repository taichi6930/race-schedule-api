import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchRaceFilterEntity } from '../../../../src/repository/entity/filter/searchRaceFilterEntity';
import { OldRaceService } from '../../../../src/service/implement/oldRaceService';
import type { IOldRaceService } from '../../../../src/service/interface/IOldRaceService';
import { DataLocation } from '../../../../src/utility/dataType';
import type { TestRepositorySetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../utility/testSetupHelper';
import {
    baseRaceEntityList,
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../mock/common/baseCommonData';

describe('RaceService', () => {
    let repositorySetup: TestRepositorySetup;
    let service: IOldRaceService;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();
        service = container.resolve(OldRaceService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催データがStorageから取得できること', async () => {
            // モックの戻り値を設定
            repositorySetup.raceRepositoryFromStorage.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const searchRaceFilter = new SearchRaceFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
                [],
                [],
                [],
            );

            const result = await service.fetchRaceEntityList(
                searchRaceFilter,
                DataLocation.Storage,
            );

            expect(result).toBe(mockRaceEntityList);
        });

        it('正常に開催データがWebから取得できること', async () => {
            // モックの戻り値を設定
            repositorySetup.raceRepositoryFromHtml.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchRaceFilterEntity) => {
                    const { raceTypeList } = searchFilter;
                    return raceTypeList.flatMap((raceType) =>
                        baseRaceEntityList(raceType),
                    );
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const searchRaceFilter = new SearchRaceFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
                [],
                [],
                [],
            );

            const result = await service.fetchRaceEntityList(
                searchRaceFilter,
                DataLocation.Web,
            );

            expect(result.length).toBe(mockRaceEntityList.length);
            for (const entity of result) {
                // 同じIDのデータが存在すること
                expect(
                    mockRaceEntityList.find((e) => e.id === entity.id),
                ).toBeDefined();
            }
        });
    });

    describe('updateRaceEntityList', () => {
        it('正常に開催データが更新されること', async () => {
            await service.upsertRaceEntityList(mockRaceEntityList);

            expect(
                repositorySetup.raceRepositoryFromHtml.fetchRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                repositorySetup.raceRepositoryFromStorage.upsertRaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});

// RaceEntity {
//         id: 'jra202406010501',
//         placeId: 'jra2024060105',
//         raceData: RaceData {
//           raceType: 'JRA',
//           name: 'テスト東京新馬1レース',
//           dateTime: 2024-06-01T07:00:00.000Z,
//           location: '東京',
//           grade: '新馬',
//           number: 1
//         },
//         _heldDayData: HeldDayData { heldTimes: 1, heldDayTimes: 1 },
//         _conditionData: HorseRaceConditionData { surfaceType: '芝', distance: 2500 },
//         _stage: undefined,
//         _racePlayerDataList: undefined
//       }

//    RaceEntity {
//         id: 'jra202406010501',
//         placeId: 'jra2024060105',
//         raceData: RaceData {
//           raceType: 'JRA',
//           name: 'テスト東京新馬1レース',
//           dateTime: 2024-06-01T07:00:00.000Z,
//           location: '東京',
//           grade: '新馬',
//           number: 1
//         },
//         _heldDayData: HeldDayData { heldTimes: 1, heldDayTimes: 1 },
//         _conditionData: HorseRaceConditionData { surfaceType: '芝', distance: 2500 },
//         _stage: undefined,
//         _racePlayerDataList: undefined
//       }
