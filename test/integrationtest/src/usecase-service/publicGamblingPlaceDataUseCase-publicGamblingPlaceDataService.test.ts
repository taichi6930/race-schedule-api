import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { MechanicalRacingPlaceEntity } from '../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { PublicGamblingPlaceDataService } from '../../../../lib/src/service/implement/publicGamblingPlaceDataService';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceDataUseCase } from '../../../../lib/src/usecase/implement/publicGamblingPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../../lib/src/usecase/interface/IPlaceDataUseCase';
import { RaceType } from '../../../../lib/src/utility/raceType';
import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
} from '../../../unittest/src/mock/common/baseAutoraceData';
import {
    baseBoatracePlaceData,
    baseBoatracePlaceEntity,
} from '../../../unittest/src/mock/common/baseBoatraceData';
import {
    baseJraPlaceData,
    basePlaceEntity,
} from '../../../unittest/src/mock/common/baseJraData';
import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../../unittest/src/mock/common/baseKeirinData';
import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../../unittest/src/mock/common/baseNarData';
import type { TestSetup } from '../../../utility/testSetupHelper';
import { setupTestMock } from '../../../utility/testSetupHelper';
import type { SearchPlaceFilterEntity } from './../../../../lib/src/repository/entity/searchPlaceFilterEntity';

describe('PublicGamblingPlaceDataUseCase-publicGamblingPlaceDataService', () => {
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
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let mechanicalRacingPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let service: IPlaceDataService;
    let useCase: IPlaceDataUseCase;

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
        container.registerInstance<IPlaceDataService>(
            'PublicGamblingPlaceDataService',
            service,
        );
        useCase = container.resolve(PublicGamblingPlaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること', async () => {
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

            const result = await useCase.fetchPlaceDataList(
                startDate,
                finishDate,
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.KEIRIN,
                    RaceType.AUTORACE,
                    RaceType.BOATRACE,
                ],
            );

            expect(result).toEqual([
                baseJraPlaceData,
                baseNarPlaceData,
                baseKeirinPlaceData,
                baseAutoracePlaceData,
                baseBoatracePlaceData,
            ]);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
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
            mechanicalRacingPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockResolvedValue(
                {
                    code: 200,
                    message: '',
                    successData: [
                        baseKeirinPlaceEntity,
                        baseBoatracePlaceEntity,
                        baseAutoracePlaceEntity,
                    ],
                    failureData: [],
                },
            );
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

            await useCase.updatePlaceDataList(startDate, finishDate, [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]);

            expect(
                mechanicalRacingPlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
