import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import type { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { PublicGamblingPlaceDataService } from '../../../../../lib/src/service/implement/publicGamblingPlaceDataService';
import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import { DataLocation } from '../../../../../lib/src/utility/dataType';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import { baseAutoracePlaceEntity } from '../../mock/common/baseAutoraceData';
import { baseBoatracePlaceEntity } from '../../mock/common/baseBoatraceData';
import { basePlaceEntity } from '../../mock/common/baseJraData';
import { baseKeirinPlaceEntity } from '../../mock/common/baseKeirinData';
import { baseNarPlaceEntity } from '../../mock/common/baseNarData';

describe('PublicGamblingPlaceDataService', () => {
    let jraPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let horseRacingPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let narPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let mechanicalRacingPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let service: IPlaceDataService;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({
            jraPlaceRepositoryFromHtmlImpl,
            horseRacingPlaceRepositoryFromStorageImpl,
            narPlaceRepositoryFromHtmlImpl,
            keirinPlaceRepositoryFromHtmlImpl,
            boatracePlaceRepositoryFromHtmlImpl,
            autoracePlaceRepositoryFromHtmlImpl,
            mechanicalRacingPlaceRepositoryFromStorageImpl,
        } = setup);

        service = container.resolve(PublicGamblingPlaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            const mockPlaceEntity = {
                [RaceType.JRA]: [basePlaceEntity],
                [RaceType.NAR]: [baseNarPlaceEntity],
                [RaceType.OVERSEAS]: [],
                [RaceType.KEIRIN]: [baseKeirinPlaceEntity],
                [RaceType.AUTORACE]: [baseAutoracePlaceEntity],
                [RaceType.BOATRACE]: [baseBoatracePlaceEntity],
            };

            // モックの戻り値を設定
            horseRacingPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.OVERSEAS:
                        case RaceType.KEIRIN:
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA: {
                            return [basePlaceEntity];
                        }
                        case RaceType.NAR: {
                            return [baseNarPlaceEntity];
                        }
                    }
                },
            );
            mechanicalRacingPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.KEIRIN: {
                            return [baseKeirinPlaceEntity];
                        }
                        case RaceType.BOATRACE: {
                            return [baseBoatracePlaceEntity];
                        }
                        case RaceType.AUTORACE: {
                            return [baseAutoracePlaceEntity];
                        }
                    }
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.KEIRIN,
                    RaceType.AUTORACE,
                    RaceType.BOATRACE,
                ],
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常に開催場データが取得できること（web）', async () => {
            const mockPlaceEntity = {
                [RaceType.JRA]: [basePlaceEntity],
                [RaceType.NAR]: [baseNarPlaceEntity],
                [RaceType.OVERSEAS]: [],
                [RaceType.KEIRIN]: [baseKeirinPlaceEntity],
                [RaceType.AUTORACE]: [baseAutoracePlaceEntity],
                [RaceType.BOATRACE]: [baseBoatracePlaceEntity],
            };

            // モックの戻り値を設定
            jraPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity],
            );
            narPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseNarPlaceEntity],
            );
            keirinPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseKeirinPlaceEntity],
            );
            autoracePlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseAutoracePlaceEntity],
            );
            boatracePlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseBoatracePlaceEntity],
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.KEIRIN,
                    RaceType.AUTORACE,
                    RaceType.BOATRACE,
                ],
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('開催場データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            mechanicalRacingPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
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
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.KEIRIN,
                    RaceType.AUTORACE,
                    RaceType.BOATRACE,
                ],
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            const mockPlaceEntity = {
                [RaceType.JRA]: [basePlaceEntity],
                [RaceType.NAR]: [baseNarPlaceEntity],
                [RaceType.OVERSEAS]: [],
                [RaceType.KEIRIN]: [baseKeirinPlaceEntity],
                [RaceType.AUTORACE]: [baseAutoracePlaceEntity],
                [RaceType.BOATRACE]: [baseBoatracePlaceEntity],
            };

            // モックの戻り値を設定
            horseRacingPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.OVERSEAS:
                        case RaceType.KEIRIN:
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA: {
                            return [basePlaceEntity];
                        }
                        case RaceType.NAR: {
                            return [baseNarPlaceEntity];
                        }
                    }
                },
            );
            mechanicalRacingPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.KEIRIN: {
                            return [baseKeirinPlaceEntity];
                        }
                        case RaceType.BOATRACE: {
                            return [baseBoatracePlaceEntity];
                        }
                        case RaceType.AUTORACE: {
                            return [baseAutoracePlaceEntity];
                        }
                    }
                },
            );

            // registerPlaceEntityList の戻り値を正しい型でモック
            horseRacingPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockImplementation(
                async (raceType: RaceType, placeEntityList: PlaceEntity[]) => {
                    if (
                        raceType === RaceType.JRA ||
                        raceType === RaceType.NAR
                    ) {
                        return {
                            code: 200,
                            message: '',
                            successData: placeEntityList,
                            failureData: [],
                        };
                    }
                    return {
                        code: 200,
                        message: '',
                        successData: [],
                        failureData: [],
                    };
                },
            );

            mechanicalRacingPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockImplementation(
                async (raceType: RaceType, placeEntityList: PlaceEntity[]) => {
                    if (
                        raceType === RaceType.KEIRIN ||
                        raceType === RaceType.AUTORACE ||
                        raceType === RaceType.BOATRACE
                    ) {
                        return {
                            code: 200,
                            message: '',
                            successData: placeEntityList,
                            failureData: [],
                        };
                    }
                    return {
                        code: 200,
                        message: '',
                        successData: [],
                        failureData: [],
                    };
                },
            );
            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                mechanicalRacingPlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('開催場データの件数が0の場合、Repositoryを呼び出さないこと', async () => {
            await service.updatePlaceEntityList({
                [RaceType.JRA]: [],
                [RaceType.NAR]: [],
                [RaceType.OVERSEAS]: [],
                [RaceType.KEIRIN]: [],
                [RaceType.AUTORACE]: [],
                [RaceType.BOATRACE]: [],
            });

            expect(
                mechanicalRacingPlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('開催場データが更新できない場合、エラーが発生すること', async () => {
            const mockPlaceEntity = {
                [RaceType.JRA]: [basePlaceEntity],
                [RaceType.NAR]: [baseNarPlaceEntity],
                [RaceType.OVERSEAS]: [],
                [RaceType.KEIRIN]: [baseKeirinPlaceEntity],
                [RaceType.AUTORACE]: [baseAutoracePlaceEntity],
                [RaceType.BOATRACE]: [baseBoatracePlaceEntity],
            };
            // モックの戻り値を設定（エラーが発生するように設定）
            horseRacingPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );
            mechanicalRacingPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await expect(
                service.updatePlaceEntityList(mockPlaceEntity),
            ).rejects.toThrow('開催場データの登録に失敗しました');

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
