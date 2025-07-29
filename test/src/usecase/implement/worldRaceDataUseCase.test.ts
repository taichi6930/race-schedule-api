import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { WorldRaceDataUseCase } from '../../../../lib/src/usecase/implement/worldRaceDataUseCase';
import {
    baseWorldRaceDataList,
    baseWorldRaceEntityList,
} from '../../mock/common/baseWorldData';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('WorldRaceDataUseCase', () => {
    let raceDataService: jest.Mocked<IRaceDataService>;
    let useCase: WorldRaceDataUseCase;

    beforeEach(() => {
        raceDataService = raceDataServiceMock();
        container.registerInstance<IRaceDataService>(
            'PublicGamblingRaceDataService',
            raceDataService,
        );
        useCase = container.resolve(WorldRaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        for (const { searchConditions, descriptions, expectedLength } of [
            {
                searchConditions: { gradeList: ['GⅠ'] },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
            },
            {
                searchConditions: {
                    locationList: ['パリロンシャン'],
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['GⅠ'],
                    locationList: ['パリロンシャン'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['GⅠ'],
                    locationList: ['サンクルー'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
            },
            {
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 24,
            },
        ]) {
            it(`正常にレース開催データが取得できること（${descriptions}${expectedLength.toString()}件になる）`, async () => {
                // モックの戻り値を設定
                raceDataService.fetchRaceEntityList.mockResolvedValue({
                    world: baseWorldRaceEntityList,
                    jra: [],
                    nar: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                });

                const startDate = new Date('2025-12-01');
                const finishDate = new Date('2025-12-31');

                const result = await useCase.fetchRaceDataList(
                    startDate,
                    finishDate,
                    searchConditions,
                );

                expect(result.length).toBe(expectedLength);
            });
        }
    });

    describe('updateRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                world: baseWorldRaceEntityList,
                jra: [],
                nar: [],
                keirin: [],
                autorace: [],
                boatrace: [],
            });

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceData: WorldRaceData[] = baseWorldRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
