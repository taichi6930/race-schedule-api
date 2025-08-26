import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import type { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { PlaceService } from '../../../../../lib/src/service/implement/placeService';
import type { IPlaceService } from '../../../../../lib/src/service/interface/IPlaceService';
import { DataLocation } from '../../../../../lib/src/utility/dataType';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestRepositorySetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../../utility/testSetupHelper';
import {
    basePlaceEntity,
    mockPlaceEntityList,
    testRaceTypeListWithoutOverseas,
} from '../../mock/common/baseCommonData';

describe('PublicGamblingPlaceService', () => {
    let repositorySetup: TestRepositorySetup;
    let service: IPlaceService;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();
        service = container.resolve(PlaceService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            // モックの戻り値を設定
            repositorySetup.placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.KEIRIN:
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            return [basePlaceEntity(searchFilter.raceType)];
                        }
                    }
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });

        it('正常に開催場データが取得できること（web）', async () => {
            // モックの戻り値を設定
            repositorySetup.placeRepositoryFromHtml.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    return [basePlaceEntity(searchFilter.raceType)];
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });

        it('開催場データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            repositorySetup.placeRepositoryFromStorage.fetchPlaceEntityList.mockRejectedValue(
                new Error('開催場データの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('並列で取得されていること（副作用なし）', async () => {
            let inFlight = 0;
            let maxConcurrent = 0;

            repositorySetup.placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    inFlight++;
                    maxConcurrent = Math.max(maxConcurrent, inFlight);
                    // 少し待つことで並列性を検出
                    await new Promise((r) => setTimeout(r, 30));
                    inFlight--;
                    return [basePlaceEntity(searchFilter.raceType)];
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
                DataLocation.Storage,
            );

            // 並列で 2 以上の同時実行が発生しているはず
            expect(maxConcurrent).toBeGreaterThanOrEqual(2);
            expect(result).toEqual(mockPlaceEntityList);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            // モックの戻り値を設定
            repositorySetup.placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.KEIRIN:
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            return [basePlaceEntity(searchFilter.raceType)];
                        }
                    }
                },
            );

            // registerPlaceEntityList の戻り値を正しい型でモック
            repositorySetup.placeRepositoryFromStorage.registerPlaceEntityList.mockImplementation(
                async (raceType: RaceType, placeEntityList: PlaceEntity[]) => {
                    {
                        return {
                            code: 200,
                            message: '',
                            successData: placeEntityList,
                            failureData: [],
                        };
                    }
                },
            );

            await service.updatePlaceEntityList(mockPlaceEntityList);

            expect(
                repositorySetup.placeRepositoryFromStorage
                    .registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('開催場データの件数が0の場合、Repositoryを呼び出さないこと', async () => {
            await service.updatePlaceEntityList([]);

            expect(
                repositorySetup.placeRepositoryFromStorage
                    .registerPlaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('開催場データが更新できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            repositorySetup.placeRepositoryFromStorage.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await expect(
                service.updatePlaceEntityList(mockPlaceEntityList),
            ).rejects.toThrow('開催場データの登録に失敗しました');

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('並列で登録され、集計が正しいこと（副作用なし）', async () => {
            let inFlight = 0;
            let maxConcurrent = 0;

            // fetch は既存と同じ挙動
            repositorySetup.placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    return [basePlaceEntity(searchFilter.raceType)];
                },
            );

            // register は遅延を入れて並列性を確認
            repositorySetup.placeRepositoryFromStorage.registerPlaceEntityList.mockImplementation(
                async (raceType: RaceType, placeEntityList: PlaceEntity[]) => {
                    inFlight++;
                    maxConcurrent = Math.max(maxConcurrent, inFlight);
                    await new Promise((r) => setTimeout(r, 30));
                    inFlight--;
                    return {
                        code: 200,
                        message: '',
                        successData: placeEntityList,
                        failureData: [],
                    };
                },
            );

            const result =
                await service.updatePlaceEntityList(mockPlaceEntityList);

            expect(maxConcurrent).toBeGreaterThanOrEqual(2);
            // 全件成功していれば successDataCount は送った件数と同じ
            const totalSent = mockPlaceEntityList.length;
            expect(result.successDataCount).toBe(totalSent);
            expect(result.failureDataCount).toBe(0);
        });
    });
});
