import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import type { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import type { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { PublicGamblingRaceDataService } from '../../../../../lib/src/service/implement/publicGamblingRaceDataService';
import type { IRaceDataService } from '../../../../../lib/src/service/interface/IRaceDataService';
import { DataLocation } from '../../../../../lib/src/utility/dataType';
import {
    ALL_RACE_TYPE_LIST,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import { baseAutoraceRaceEntityList } from '../../mock/common/baseAutoraceData';
import { baseBoatraceRaceEntityList } from '../../mock/common/baseBoatraceData';
import { baseJraRaceEntityList } from '../../mock/common/baseJraData';
import { baseKeirinRaceEntityList } from '../../mock/common/baseKeirinData';
import { baseNarRaceEntityList } from '../../mock/common/baseNarData';
import { baseOverseasRaceEntityList } from '../../mock/common/baseOverseasData';

describe('PublicGamblingRaceDataService', () => {
    let raceRepositoryFromStorage: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    let jraRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    let narRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    let overseasRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    let mechanicalRacingRaceRepositoryFromStorage: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    let keirinRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    let boatraceRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    let autoraceRaceRepositoryFromHtml: jest.Mocked<
        IRaceRepository<RaceEntity, PlaceEntity>
    >;
    let service: IRaceDataService;

    const mockRaceEntityList = [
        ...baseJraRaceEntityList,
        ...baseNarRaceEntityList,
        ...baseOverseasRaceEntityList,
        ...baseKeirinRaceEntityList,
        ...baseAutoraceRaceEntityList,
        ...baseBoatraceRaceEntityList,
    ];

    const baseRaceEntityListMap = {
        [RaceType.JRA]: baseJraRaceEntityList,
        [RaceType.NAR]: baseNarRaceEntityList,
        [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
        [RaceType.KEIRIN]: baseKeirinRaceEntityList,
        [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
        [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
    };

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
                            return baseRaceEntityListMap[searchFilter.raceType];
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
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            return baseRaceEntityListMap[searchFilter.raceType];
                        }
                    }
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                ALL_RACE_TYPE_LIST,
                DataLocation.Storage,
            );
            expect(result).toEqual(mockRaceEntityList);
        });

        it('正常にレース開催データが取得できること（web）', async () => {
            // モックの戻り値を設定
            jraRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityListMap[RaceType.JRA],
            );
            narRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityListMap[RaceType.NAR],
            );
            overseasRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityListMap[RaceType.OVERSEAS],
            );
            keirinRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityListMap[RaceType.KEIRIN],
            );
            boatraceRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityListMap[RaceType.BOATRACE],
            );
            autoraceRaceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
                baseRaceEntityListMap[RaceType.AUTORACE],
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                ALL_RACE_TYPE_LIST,
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
                ALL_RACE_TYPE_LIST,
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
                            return baseRaceEntityListMap[searchFilter.raceType];
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
                            return baseRaceEntityListMap[searchFilter.raceType];
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
                                successData: baseRaceEntityListMap[raceType],
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
                                successData: baseRaceEntityListMap[raceType],
                                failureData: [],
                            };
                        }
                    }
                },
            );

            await service.updateRaceEntityList(mockRaceEntityList);

            for (const raceType of [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.OVERSEAS,
            ]) {
                expect(
                    raceRepositoryFromStorage.registerRaceEntityList,
                ).toHaveBeenCalledWith(
                    raceType,
                    baseRaceEntityListMap[raceType],
                );
            }

            for (const raceType of [
                RaceType.KEIRIN,
                RaceType.BOATRACE,
                RaceType.AUTORACE,
            ]) {
                expect(
                    mechanicalRacingRaceRepositoryFromStorage.registerRaceEntityList,
                ).toHaveBeenCalledWith(
                    raceType,
                    baseRaceEntityListMap[raceType],
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
