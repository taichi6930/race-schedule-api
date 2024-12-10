import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { KeirinRaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinRaceDataUseCase';
import type {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../../../../lib/src/utility/data/keirin';
import {
    baseKeirinPlaceEntity,
    baseKeirinRaceDataList,
    baseKeirinRaceEntity,
    baseKeirinRaceEntityList,
} from '../../mock/common/baseKeirinData';
import { mockKeirinPlaceRepositoryFromStorageImpl } from '../../mock/repository/keirinPlaceRepositoryFromStorageImpl';
import { mockKeirinRaceRepositoryFromHtmlImpl } from '../../mock/repository/keirinRaceRepositoryFromHtmlImpl';
import { mockKeirinRaceRepositoryFromStorageImpl } from '../../mock/repository/keirinRaceRepositoryFromStorageImpl';

describe('KeirinRaceDataUseCase', () => {
    let keirinRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let useCase: KeirinRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        keirinRaceRepositoryFromStorageImpl =
            mockKeirinRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromStorage', {
            useValue: keirinRaceRepositoryFromStorageImpl,
        });
        keirinRaceRepositoryFromHtmlImpl =
            mockKeirinRaceRepositoryFromHtmlImpl();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useValue: keirinRaceRepositoryFromHtmlImpl,
        });

        // keirinPlaceRepositoryFromStorageImplをコンテナに登録
        keirinPlaceRepositoryFromStorageImpl =
            mockKeirinPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: keirinPlaceRepositoryFromStorageImpl,
            },
        );

        // KeirinRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(KeirinRaceDataUseCase);
    });

    const baseRaceEntity = baseKeirinRaceEntity;

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: KeirinRaceData[] = baseKeirinRaceDataList;
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });

        [
            {
                searchConditions: { gradeList: ['GP' as KeirinGradeType] },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    locationList: ['平塚' as KeirinRaceCourse],
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: { stageList: ['決勝' as KeirinRaceStage] },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 6,
            },
            {
                searchConditions: {
                    gradeList: ['GP' as KeirinGradeType],
                    locationList: ['平塚' as KeirinRaceCourse],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['GP' as KeirinGradeType],
                    locationList: ['小倉' as KeirinRaceCourse],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
            },
            {
                searchConditions: {
                    gradeList: ['GP' as KeirinGradeType],
                    stageList: ['決勝' as KeirinRaceStage],
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    locationList: ['平塚' as KeirinRaceCourse],
                    stageList: ['決勝' as KeirinRaceStage],
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['GP' as KeirinGradeType],
                    locationList: ['平塚' as KeirinRaceCourse],
                    stageList: ['決勝' as KeirinRaceStage],
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 72,
            },
        ].forEach(({ searchConditions, descriptions, expectedLength }) => {
            it(`正常にレースデータが取得できること（${descriptions}）`, async () => {
                const mockRaceEntity: KeirinRaceEntity[] =
                    baseKeirinRaceEntityList;

                // モックの戻り値を設定
                keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                    new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
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
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];
            const mockRaceEntity: KeirinRaceEntity[] = [baseRaceEntity];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['GP' as KeirinGradeType],
                locationList: ['平塚' as KeirinRaceCourse],
            };

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceEntity>(mockPlaceEntity),
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(
                keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromHtmlImpl.fetchRaceEntityList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('競輪場がない時、正常にレースデータが更新されないこと', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [];
            const mockRaceEntity: KeirinRaceEntity[] = [baseRaceEntity];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['GP' as KeirinGradeType],
                locationList: ['平塚' as KeirinRaceCourse],
            };

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceEntity>(mockPlaceEntity),
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(
                keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromHtmlImpl.fetchRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('検索条件がなく、正常にレースデータが更新されること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];
            const mockRaceEntity: KeirinRaceEntity[] = [baseRaceEntity];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {};

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceEntity>(mockPlaceEntity),
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(
                keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromHtmlImpl.fetchRaceEntityList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定（エラーが発生するように設定）
            keirinRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: KeirinRaceData[] = baseKeirinRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceData: KeirinRaceData[] = baseKeirinRaceDataList;
            // モックの戻り値を設定（エラーが発生するように設定）
            keirinRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
                new Error('レースデータの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.upsertRaceDataList(mockRaceData);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
