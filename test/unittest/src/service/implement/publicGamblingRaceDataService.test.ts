import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { HorseRacingRaceEntity } from '../../../../../lib/src/repository/entity/horseRacingRaceEntity';
import type { JraRaceEntity } from '../../../../../lib/src/repository/entity/jraRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import type { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { PublicGamblingRaceDataService } from '../../../../../lib/src/service/implement/publicGamblingRaceDataService';
import type { IRaceDataService } from '../../../../../lib/src/service/interface/IRaceDataService';
import { DataLocation } from '../../../../../lib/src/utility/dataType';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import { baseAutoraceRaceEntityList } from '../../mock/common/baseAutoraceData';
import { baseBoatraceRaceEntityList } from '../../mock/common/baseBoatraceData';
import { baseJraRaceEntityList } from '../../mock/common/baseJraData';
import { baseKeirinRaceEntityList } from '../../mock/common/baseKeirinData';
import { baseNarRaceEntityList } from '../../mock/common/baseNarData';
import { baseOverseasRaceEntityList } from '../../mock/common/baseOverseasData';

describe('PublicGamblingRaceDataService', () => {
    let jraRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, PlaceEntity>
    >;
    let jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, PlaceEntity>
    >;
    let narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >;
    let horseRacingRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >;
    let overseasRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, PlaceEntity>
    >;
    let mechanicalRacingRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let service: IRaceDataService;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({
            jraRaceRepositoryFromStorageImpl,
            horseRacingRaceRepositoryFromStorageImpl,
            mechanicalRacingRaceRepositoryFromStorageImpl,
            jraRaceRepositoryFromHtmlImpl,
            narRaceRepositoryFromHtmlImpl,
            overseasRaceRepositoryFromHtmlImpl,
            keirinRaceRepositoryFromHtmlImpl,
            boatraceRaceRepositoryFromHtmlImpl,
            autoraceRaceRepositoryFromHtmlImpl,
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
            jraRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseJraRaceEntityList,
            );
            horseRacingRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.KEIRIN:
                        case RaceType.BOATRACE:
                        case RaceType.AUTORACE: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.NAR: {
                            return baseNarRaceEntityList;
                        }
                        case RaceType.OVERSEAS: {
                            return baseOverseasRaceEntityList;
                        }
                    }
                },
            );
            mechanicalRacingRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.KEIRIN: {
                            return baseKeirinRaceEntityList;
                        }
                        case RaceType.BOATRACE: {
                            return baseBoatraceRaceEntityList;
                        }
                        case RaceType.AUTORACE: {
                            return baseAutoraceRaceEntityList;
                        }
                    }
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.OVERSEAS,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
                DataLocation.Storage,
            );
            expect(result).toEqual({
                [RaceType.JRA]: baseJraRaceEntityList,
                [RaceType.NAR]: baseNarRaceEntityList,
                [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
                [RaceType.KEIRIN]: baseKeirinRaceEntityList,
                [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
                [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
            });
        });

        it('正常にレース開催データが取得できること（web）', async () => {
            // モックの戻り値を設定
            jraRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseJraRaceEntityList,
            );
            narRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseNarRaceEntityList,
            );
            overseasRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseOverseasRaceEntityList,
            );
            keirinRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseKeirinRaceEntityList,
            );
            boatraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseBoatraceRaceEntityList,
            );
            autoraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseAutoraceRaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.OVERSEAS,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
                DataLocation.Web,
            );

            expect(result).toEqual({
                [RaceType.JRA]: baseJraRaceEntityList,
                [RaceType.NAR]: baseNarRaceEntityList,
                [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
                [RaceType.KEIRIN]: baseKeirinRaceEntityList,
                [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
                [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
            });
        });

        it('レース開催データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            mechanicalRacingRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
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
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.OVERSEAS,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updateRaceEntityList', () => {
        it('正常にレース開催データが更新されること', async () => {
            // モックの戻り値を設定
            jraRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseJraRaceEntityList,
            );
            horseRacingRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.KEIRIN:
                        case RaceType.BOATRACE:
                        case RaceType.AUTORACE: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.NAR: {
                            return baseNarRaceEntityList;
                        }
                        case RaceType.OVERSEAS: {
                            return baseOverseasRaceEntityList;
                        }
                    }
                },
            );
            mechanicalRacingRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.KEIRIN: {
                            return baseKeirinRaceEntityList;
                        }
                        case RaceType.BOATRACE: {
                            return baseBoatraceRaceEntityList;
                        }
                        case RaceType.AUTORACE: {
                            return baseAutoraceRaceEntityList;
                        }
                    }
                },
            );

            // registerRaceEntityListのモック戻り値を設定
            jraRaceRepositoryFromStorageImpl.registerRaceEntityList.mockResolvedValue(
                {
                    code: 200,
                    message: 'OK',
                    successData: baseJraRaceEntityList,
                    failureData: [],
                },
            );
            horseRacingRaceRepositoryFromStorageImpl.registerRaceEntityList.mockImplementation(
                async (raceType: RaceType) => {
                    switch (raceType) {
                        case RaceType.JRA:
                        case RaceType.KEIRIN:
                        case RaceType.BOATRACE:
                        case RaceType.AUTORACE: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.NAR: {
                            return {
                                code: 200,
                                message: 'OK',
                                successData: baseNarRaceEntityList,
                                failureData: [],
                            };
                        }
                        case RaceType.OVERSEAS: {
                            return {
                                code: 200,
                                message: 'OK',
                                successData: baseOverseasRaceEntityList,
                                failureData: [],
                            };
                        }
                    }
                },
            );
            mechanicalRacingRaceRepositoryFromStorageImpl.registerRaceEntityList.mockImplementation(
                async (raceType: RaceType) => {
                    switch (raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.KEIRIN: {
                            return {
                                code: 200,
                                message: 'OK',
                                successData: baseKeirinRaceEntityList,
                                failureData: [],
                            };
                        }
                        case RaceType.BOATRACE: {
                            return {
                                code: 200,
                                message: 'OK',
                                successData: baseBoatraceRaceEntityList,
                                failureData: [],
                            };
                        }
                        case RaceType.AUTORACE: {
                            return {
                                code: 200,
                                message: 'OK',
                                successData: baseAutoraceRaceEntityList,
                                failureData: [],
                            };
                        }
                    }
                },
            );

            await service.updateRaceEntityList({
                [RaceType.JRA]: baseJraRaceEntityList,
                [RaceType.NAR]: baseNarRaceEntityList,
                [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
                [RaceType.KEIRIN]: baseKeirinRaceEntityList,
                [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
                [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
            });

            expect(
                jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(RaceType.JRA, baseJraRaceEntityList);
            expect(
                horseRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(RaceType.NAR, baseNarRaceEntityList);
            expect(
                horseRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(
                RaceType.OVERSEAS,
                baseOverseasRaceEntityList,
            );
            expect(
                mechanicalRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(RaceType.KEIRIN, baseKeirinRaceEntityList);
            expect(
                mechanicalRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(
                RaceType.BOATRACE,
                baseBoatraceRaceEntityList,
            );
            expect(
                mechanicalRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(
                RaceType.AUTORACE,
                baseAutoraceRaceEntityList,
            );
        });

        it('レース開催データが0件の場合、更新処理が実行されないこと', async () => {
            await service.updateRaceEntityList({
                [RaceType.JRA]: [],
                [RaceType.NAR]: [],
                [RaceType.OVERSEAS]: [],
                [RaceType.KEIRIN]: [],
                [RaceType.AUTORACE]: [],
                [RaceType.BOATRACE]: [],
            });

            expect(
                jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                horseRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                mechanicalRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });
    });
});
