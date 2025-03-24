import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { NarRaceDataUseCase } from '../../../../lib/src/usecase/implement/narRaceDataUseCase';
import {
    baseNarRaceDataList,
    baseNarRaceEntity,
    baseNarRaceEntityList,
} from '../../mock/common/baseNarData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('NarRaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService<NarPlaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<NarRaceEntity, NarPlaceEntity>
    >;
    let useCase: NarRaceDataUseCase;

    beforeEach(() => {
        placeDataService = placeDataServiceMock<NarPlaceEntity>();
        container.registerInstance<IPlaceDataService<NarPlaceEntity>>(
            'NarPlaceDataService',
            placeDataService,
        );

        raceDataService = raceDataServiceMock<NarRaceEntity, NarPlaceEntity>();
        container.registerInstance<
            IRaceDataService<NarRaceEntity, NarPlaceEntity>
        >('NarRaceDataService', raceDataService);

        useCase = container.resolve(NarRaceDataUseCase);
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
                    locationList: ['大井'],
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['GⅠ'],
                    locationList: ['大井'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['GⅠ'],
                    locationList: ['佐賀'],
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
                raceDataService.fetchRaceEntityList.mockResolvedValue(
                    baseNarRaceEntityList,
                );

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
            const mockRaceEntity: NarRaceEntity[] = [baseNarRaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceData: NarRaceData[] = baseNarRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
