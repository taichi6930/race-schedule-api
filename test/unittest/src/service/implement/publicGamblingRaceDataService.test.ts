import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { PublicGamblingRaceDataService } from '../../../../../lib/src/service/implement/publicGamblingRaceDataService';
import type { IRaceDataService } from '../../../../../lib/src/service/interface/IRaceDataService';
import { DataLocation } from '../../../../../lib/src/utility/dataType';
import { IS_SHORT_TEST } from '../../../../../lib/src/utility/env';
import {
    RACE_TYPE_LIST_ALL,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import {
    baseRaceEntityList,
    mockRaceEntityList,
} from '../../mock/common/baseCommonData';

describe('PublicGamblingRaceDataService', () => {
    let raceRepositoryFromStorage: jest.Mocked<IRaceRepository>;
    let jraRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    let narRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    let overseasRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    let mechanicalRacingRaceRepositoryFromStorage: jest.Mocked<IRaceRepository>;
    let keirinRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    let boatraceRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    let autoraceRaceRepositoryFromHtml: jest.Mocked<IRaceRepository>;
    let service: IRaceDataService;

    const raceTypeList = IS_SHORT_TEST ? [RaceType.JRA] : RACE_TYPE_LIST_ALL;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({
            raceRepositoryFromStorage,
            mechanicalRacingRaceRepositoryFromStorage,
            jraRaceRepositoryFromHtml,
            narRaceRepositoryFromHtml,
            overseasRaceRepositoryFromHtml,
            keirinRaceRepositoryFromHtml,
            boatraceRaceRepositoryFromHtml,
            autoraceRaceRepositoryFromHtml,
        } = setup);
        // AutoraceRaceCalendarServiceをコンテナから取得
        service = container.resolve(PublicGamblingRaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレース開催データが取得できること（storage）', async () => {
            // モックの戻り値を設定
            raceRepositoryFromStorage.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.KEIRIN:
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            return baseRaceEntityList(searchFilter.raceType);
                        }
                    }
                },
            );
            mechanicalRacingRaceRepositoryFromStorage.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.KEIRIN:
                        case RaceType.BOATRACE:
                        case RaceType.AUTORACE: {
                            return baseRaceEntityList(searchFilter.raceType);
                        }
                    }
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                RACE_TYPE_LIST_ALL,
                DataLocation.Storage,
            );
            expect(result).toEqual(mockRaceEntityList);
        });

        it('正常にレース開催データが取得できること（web）', async () => {
            // モックの戻り値を設定
            jraRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityList(RaceType.JRA),
            );
            narRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityList(RaceType.NAR),
            );
            overseasRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityList(RaceType.OVERSEAS),
            );
            keirinRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityList(RaceType.KEIRIN),
            );
            boatraceRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityList(RaceType.BOATRACE),
            );
            autoraceRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityList(RaceType.AUTORACE),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                RACE_TYPE_LIST_ALL,
                DataLocation.Web,
            );

            expect(result).toEqual(mockRaceEntityList);
        });

        it('レース開催データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            mechanicalRacingRaceRepositoryFromStorage.fetchRaceEntityList.mockRejectedValue(
                new Error('レース開催データの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchRaceEntityList(
                startDate,
                finishDate,
                RACE_TYPE_LIST_ALL,
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updateRaceEntityList', () => {
        it('正常にレース開催データが更新されること', async () => {
            // モックの戻り値を設定
            raceRepositoryFromStorage.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.KEIRIN:
                        case RaceType.BOATRACE:
                        case RaceType.AUTORACE: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            return baseRaceEntityList(searchFilter.raceType);
                        }
                    }
                },
            );
            mechanicalRacingRaceRepositoryFromStorage.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.KEIRIN:
                        case RaceType.BOATRACE:
                        case RaceType.AUTORACE: {
                            return baseRaceEntityList(searchFilter.raceType);
                        }
                    }
                },
            );

            // registerRaceEntityListのモック戻り値を設定
            raceRepositoryFromStorage.registerRaceEntityList.mockImplementation(
                async (raceType: RaceType) => {
                    switch (raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            return {
                                code: 200,
                                message: 'OK',
                                successData: baseRaceEntityList(raceType),
                                failureData: [],
                            };
                        }
                        case RaceType.KEIRIN:
                        case RaceType.BOATRACE:
                        case RaceType.AUTORACE: {
                            throw new Error('race type is not supported');
                        }
                    }
                },
            );
            mechanicalRacingRaceRepositoryFromStorage.registerRaceEntityList.mockImplementation(
                async (raceType: RaceType) => {
                    switch (raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.KEIRIN:
                        case RaceType.BOATRACE:
                        case RaceType.AUTORACE: {
                            return {
                                code: 200,
                                message: 'OK',
                                successData: baseRaceEntityList(raceType),
                                failureData: [],
                            };
                        }
                    }
                },
            );

            await service.updateRaceEntityList(mockRaceEntityList);

            // service 呼び出し後に各レース種別ごとに repository.registerRaceEntityList が呼ばれていることを確認
            for (const raceType of raceTypeList) {
                const repository =
                    raceType === RaceType.JRA ||
                    raceType === RaceType.NAR ||
                    raceType === RaceType.OVERSEAS
                        ? raceRepositoryFromStorage
                        : mechanicalRacingRaceRepositoryFromStorage;

                expect(repository.registerRaceEntityList).toHaveBeenCalledWith(
                    raceType,
                    baseRaceEntityList(raceType),
                );
            }
        });

        it('レース開催データが0件の場合、更新処理が実行されないこと', async () => {
            await service.updateRaceEntityList([]);

            expect(
                raceRepositoryFromStorage.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                mechanicalRacingRaceRepositoryFromStorage.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });
    });
});
