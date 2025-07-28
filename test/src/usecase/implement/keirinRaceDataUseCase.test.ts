import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { KeirinRaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinRaceDataUseCase';
import {
    baseKeirinPlaceEntity,
    baseKeirinRaceDataList,
    baseKeirinRaceEntityList,
} from '../../mock/common/baseKeirinData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('KeirinRaceDataUseCase', () => {
    let raceDataService: jest.Mocked<
        IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let useCase: KeirinRaceDataUseCase;

    beforeEach(() => {
        raceDataService = raceDataServiceMock<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >();
        container.registerInstance<
            IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceDataService', raceDataService);

        placeDataService = placeDataServiceMock();
        container.registerInstance<IPlaceDataService>(
            'PublicGamblingPlaceDataService',
            placeDataService,
        );
        useCase = container.resolve(KeirinRaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        for (const { searchConditions, descriptions, expectedLength } of [
            {
                searchConditions: { gradeList: ['GP'] },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    locationList: ['平塚'],
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    stageList: ['S級決勝'],
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 6,
            },
            {
                searchConditions: {
                    gradeList: ['GP'],
                    locationList: ['平塚'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['GP'],
                    locationList: ['小倉'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
            },
            {
                searchConditions: {
                    gradeList: ['GP'],
                    stageList: ['S級決勝'],
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    locationList: ['平塚'],
                    stageList: ['S級決勝'],
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['GP'],
                    locationList: ['平塚'],
                    stageList: ['S級決勝'],
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 72,
            },
        ]) {
            it(`正常にレース開催データが取得できること（${descriptions}${expectedLength.toString()}件になる）`, async () => {
                // モックの戻り値を設定
                raceDataService.fetchRaceEntityList.mockResolvedValue(
                    baseKeirinRaceEntityList,
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
            const mockPlaceEntity = {
                jra: [],
                nar: [],
                keirin: [baseKeirinPlaceEntity],
                autorace: [],
                boatrace: [],
            };

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['GP'],
                locationList: ['平塚'],
            };

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                baseKeirinRaceEntityList,
            );
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });

        it('開催場がない時、正常にレース開催データが更新されないこと', async () => {
            const mockPlaceEntity = {
                jra: [],
                nar: [],
                keirin: [],
                autorace: [],
                boatrace: [],
            };
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['GP'],
                locationList: ['平塚'],
            };

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                baseKeirinRaceEntityList,
            );
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).not.toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).not.toHaveBeenCalled();
        });

        it('検索条件がなく、正常にレース開催データが更新されること', async () => {
            const mockPlaceEntity = {
                jra: [],
                nar: [],
                keirin: [baseKeirinPlaceEntity],
                autorace: [],
                boatrace: [],
            };
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {};

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                baseKeirinRaceEntityList,
            );
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceData: KeirinRaceData[] = baseKeirinRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
