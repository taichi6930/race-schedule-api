import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { PublicGamblingRaceService } from '../../../../../lib/src/service/implement/publicGamblingRaceService';
import type { IRaceService } from '../../../../../lib/src/service/interface/IRaceService';
import { DataLocation } from '../../../../../lib/src/utility/dataType';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestRepositorySetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../../utility/testSetupHelper';
import {
    baseRaceEntityList,
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';

describe('PublicGamblingRaceService', () => {
    let repositorySetup: TestRepositorySetup;
    let service: IRaceService;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();
        // AutoraceRaceCalendarServiceをコンテナから取得
        service = container.resolve(PublicGamblingRaceService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
        test.each([
            {
                desc: '正常にレース開催データが取得できること（storage）',
                location: DataLocation.Storage,
                setup: (): void => {
                    repositorySetup.horseRacingRaceRepositoryFromStorage.fetchRaceEntityList.mockImplementation(
                        async (searchFilter: SearchPlaceFilterEntity) => {
                            switch (searchFilter.raceType) {
                                case RaceType.KEIRIN:
                                case RaceType.AUTORACE:
                                case RaceType.BOATRACE: {
                                    throw new Error(
                                        'race type is not supported',
                                    );
                                }
                                case RaceType.JRA:
                                case RaceType.NAR:
                                case RaceType.OVERSEAS: {
                                    return baseRaceEntityList(
                                        searchFilter.raceType,
                                    );
                                }
                            }
                        },
                    );
                    repositorySetup.mechanicalRacingRaceRepositoryFromStorage.fetchRaceEntityList.mockImplementation(
                        async (searchFilter: SearchPlaceFilterEntity) => {
                            switch (searchFilter.raceType) {
                                case RaceType.JRA:
                                case RaceType.NAR:
                                case RaceType.OVERSEAS: {
                                    throw new Error(
                                        'race type is not supported',
                                    );
                                }
                                case RaceType.KEIRIN:
                                case RaceType.BOATRACE:
                                case RaceType.AUTORACE: {
                                    return baseRaceEntityList(
                                        searchFilter.raceType,
                                    );
                                }
                            }
                        },
                    );
                },
            },
            {
                desc: '正常にレース開催データが取得できること（web）',
                location: DataLocation.Web,
                setup: (): void => {
                    repositorySetup.jraRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                        baseRaceEntityList(RaceType.JRA),
                    );
                    repositorySetup.narRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                        baseRaceEntityList(RaceType.NAR),
                    );
                    repositorySetup.overseasRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                        baseRaceEntityList(RaceType.OVERSEAS),
                    );
                    repositorySetup.keirinRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                        baseRaceEntityList(RaceType.KEIRIN),
                    );
                    repositorySetup.boatraceRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                        baseRaceEntityList(RaceType.BOATRACE),
                    );
                    repositorySetup.autoraceRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                        baseRaceEntityList(RaceType.AUTORACE),
                    );
                },
            },
        ])('$desc', async ({ location, setup }) => {
            setup();
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');
            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListAll,
                location,
            );
            expect(result).toEqual(mockRaceEntityList);
        });

        it('レース開催データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            repositorySetup.horseRacingRaceRepositoryFromStorage.fetchRaceEntityList.mockRejectedValue(
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
                testRaceTypeListAll,
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updateRaceEntityList', () => {
        beforeEach(() => {
            repositorySetup.horseRacingRaceRepositoryFromStorage.fetchRaceEntityList.mockImplementation(
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
            repositorySetup.mechanicalRacingRaceRepositoryFromStorage.fetchRaceEntityList.mockImplementation(
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
            repositorySetup.horseRacingRaceRepositoryFromStorage.registerRaceEntityList.mockImplementation(
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
            repositorySetup.mechanicalRacingRaceRepositoryFromStorage.registerRaceEntityList.mockImplementation(
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
        });

        test.each(testRaceTypeListAll)(
            '正常にレース開催データが更新されること: %s',
            async (raceType) => {
                await service.updateRaceEntityList(mockRaceEntityList);
                const repository =
                    raceType === RaceType.JRA ||
                    raceType === RaceType.NAR ||
                    raceType === RaceType.OVERSEAS
                        ? repositorySetup.horseRacingRaceRepositoryFromStorage
                        : repositorySetup.mechanicalRacingRaceRepositoryFromStorage;
                expect(repository.registerRaceEntityList).toHaveBeenCalledWith(
                    raceType,
                    baseRaceEntityList(raceType),
                );
            },
        );

        it('レース開催データが0件の場合、更新処理が実行されないこと', async () => {
            await service.updateRaceEntityList([]);

            expect(
                repositorySetup.horseRacingRaceRepositoryFromStorage
                    .registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                repositorySetup.mechanicalRacingRaceRepositoryFromStorage
                    .registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });
    });
});
