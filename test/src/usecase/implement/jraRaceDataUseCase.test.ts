import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { JraRaceDataUseCase } from '../../../../lib/src/usecase/implement/jraRaceDataUseCase';
import {
    baseJraRaceDataList,
    baseJraRaceEntity,
    baseJraRaceEntityList,
} from '../../mock/common/baseJraData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('JraRaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let raceDataService: jest.Mocked<IRaceDataService>;
    let useCase: JraRaceDataUseCase;

    beforeEach(() => {
        placeDataService = placeDataServiceMock();
        container.registerInstance<IPlaceDataService>(
            'PublicGamblingPlaceDataService',
            placeDataService,
        );

        raceDataService = raceDataServiceMock();
        container.registerInstance<IRaceDataService>(
            'PublicGamblingRaceDataService',
            raceDataService,
        );

        useCase = container.resolve(JraRaceDataUseCase);
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
                    locationList: ['東京'],
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['GⅠ'],
                    locationList: ['東京'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['GⅠ'],
                    locationList: ['阪神'],
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
                    keirin: [],
                    boatrace: [],
                    nar: [],
                    world: [],
                    jra: baseJraRaceEntityList,
                    autorace: [],
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
            const mockRaceEntity: JraRaceEntity[] = [baseJraRaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                keirin: [],
                boatrace: [],
                nar: [],
                world: [],
                jra: mockRaceEntity,
                autorace: [],
            });

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceData: JraRaceData[] = baseJraRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
