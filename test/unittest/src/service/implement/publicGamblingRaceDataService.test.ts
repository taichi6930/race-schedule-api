import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import type { HorseRacingRaceEntity } from '../../../../../lib/src/repository/entity/horseRacingRaceEntity';
import type { JraPlaceEntity } from '../../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../../lib/src/repository/entity/jraRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingRaceEntity';
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
import { baseWorldRaceEntityList } from '../../mock/common/baseWorldData';

describe('PublicGamblingRaceDataService', () => {
    let jraRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    let jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    let narRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
    >;
    let narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
    >;
    let worldRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
    >;
    let worldRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
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
            jraRaceRepositoryFromHtmlImpl,
            narRaceRepositoryFromStorageImpl,
            narRaceRepositoryFromHtmlImpl,
            worldRaceRepositoryFromStorageImpl,
            worldRaceRepositoryFromHtmlImpl,
            mechanicalRacingRaceRepositoryFromStorageImpl,
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
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseNarRaceEntityList,
            );
            worldRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseWorldRaceEntityList,
            );
            mechanicalRacingRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.WORLD: {
                            throw new Error('World race type is not supported');
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
                    RaceType.WORLD,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
                DataLocation.Storage,
            );
            expect(result.jra).toEqual(baseJraRaceEntityList);
            expect(result.nar).toEqual(baseNarRaceEntityList);
            expect(result.world).toEqual(baseWorldRaceEntityList);
            expect(result.keirin).toEqual(baseKeirinRaceEntityList);
            expect(result.boatrace).toEqual(baseBoatraceRaceEntityList);
            expect(result.autorace).toEqual(baseAutoraceRaceEntityList);
        });

        it('正常にレース開催データが取得できること（web）', async () => {
            // モックの戻り値を設定
            jraRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseJraRaceEntityList,
            );
            narRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseNarRaceEntityList,
            );
            worldRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseWorldRaceEntityList,
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
                    RaceType.WORLD,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
                DataLocation.Web,
            );

            expect(result.jra).toEqual(baseJraRaceEntityList);
            expect(result.nar).toEqual(baseNarRaceEntityList);
            expect(result.world).toEqual(baseWorldRaceEntityList);
            expect(result.keirin).toEqual(baseKeirinRaceEntityList);
            expect(result.boatrace).toEqual(baseBoatraceRaceEntityList);
            expect(result.autorace).toEqual(baseAutoraceRaceEntityList);
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
                    RaceType.WORLD,
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
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseNarRaceEntityList,
            );
            worldRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseWorldRaceEntityList,
            );
            mechanicalRacingRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.WORLD: {
                            throw new Error('World race type is not supported');
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

            await service.updateRaceEntityList({
                jra: baseJraRaceEntityList,
                nar: baseNarRaceEntityList,
                world: baseWorldRaceEntityList,
                keirin: baseKeirinRaceEntityList,
                boatrace: baseBoatraceRaceEntityList,
                autorace: baseAutoraceRaceEntityList,
            });

            expect(
                jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(RaceType.JRA, baseJraRaceEntityList);
            expect(
                narRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(RaceType.NAR, baseNarRaceEntityList);
            expect(
                worldRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(RaceType.WORLD, baseWorldRaceEntityList);
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
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                autorace: [],
                boatrace: [],
            });

            expect(
                jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                narRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                worldRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                mechanicalRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                mechanicalRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                mechanicalRacingRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });
    });
});
