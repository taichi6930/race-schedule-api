import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { PublicGamblingPlaceDataService } from '../../../../lib/src/service/implement/publicGamblingPlaceDataService';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceDataUseCase } from '../../../../lib/src/usecase/implement/publicGamblingPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../../lib/src/usecase/interface/IPlaceDataUseCase';
import {
    ALL_RACE_TYPE_LIST,
    RaceType,
} from '../../../../lib/src/utility/raceType';
import { baseAutoracePlaceEntity } from '../../../unittest/src/mock/common/baseAutoraceData';
import { baseBoatracePlaceEntity } from '../../../unittest/src/mock/common/baseBoatraceData';
import { baseJraPlaceEntity } from '../../../unittest/src/mock/common/baseJraData';
import { baseKeirinPlaceEntity } from '../../../unittest/src/mock/common/baseKeirinData';
import { baseNarPlaceEntity } from '../../../unittest/src/mock/common/baseNarData';
import type { TestSetup } from '../../../utility/testSetupHelper';
import { setupTestMock } from '../../../utility/testSetupHelper';
import type { SearchPlaceFilterEntity } from './../../../../lib/src/repository/entity/searchPlaceFilterEntity';

describe('PublicGamblingPlaceDataUseCase-publicGamblingPlaceDataService', () => {
    let placeRepositoryFromStorage: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    let jraPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    let narPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository<PlaceEntity>>;
    let keirinPlaceRepositoryFromHtml: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let boatracePlaceRepositoryFromHtml: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let autoracePlaceRepositoryFromHtml: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let service: IPlaceDataService;
    let useCase: IPlaceDataUseCase;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({
            placeRepositoryFromStorage,
            jraPlaceRepositoryFromHtml,
            narPlaceRepositoryFromHtml,
            keirinPlaceRepositoryFromHtml,
            boatracePlaceRepositoryFromHtml,
            autoracePlaceRepositoryFromHtml,
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

    const basePlaceEntityMap = {
        [RaceType.JRA]: baseJraPlaceEntity,
        [RaceType.NAR]: baseNarPlaceEntity,
        [RaceType.OVERSEAS]: undefined, // 海外競馬は未対応
        [RaceType.KEIRIN]: baseKeirinPlaceEntity,
        [RaceType.BOATRACE]: baseBoatracePlaceEntity,
        [RaceType.AUTORACE]: baseAutoracePlaceEntity,
    };

    const mockPlaceEntity = [
        baseJraPlaceEntity,
        baseNarPlaceEntity,
        baseKeirinPlaceEntity,
        baseAutoracePlaceEntity,
        baseBoatracePlaceEntity,
    ];

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること', async () => {
            // モックの戻り値を設定
            placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
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
                            return [basePlaceEntityMap[searchFilter.raceType]];
                        }
                    }
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceEntityList(
                startDate,
                finishDate,
                ALL_RACE_TYPE_LIST,
            );

            expect(result).toEqual(mockPlaceEntity);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            placeRepositoryFromStorage.registerPlaceEntityList.mockImplementation(
                async (raceType: RaceType, placeEntityList: PlaceEntity[]) => {
                    return {
                        code: 200,
                        message: '',
                        successData: placeEntityList,
                        failureData: [],
                    };
                },
            );
            // モックの戻り値を設定
            placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
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
                            return [basePlaceEntityMap[searchFilter.raceType]];
                        }
                    }
                },
            );

            // モックの戻り値を設定
            jraPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue([
                baseJraPlaceEntity,
            ]);
            narPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue([
                baseNarPlaceEntity,
            ]);
            keirinPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [baseKeirinPlaceEntity],
            );
            autoracePlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [baseAutoracePlaceEntity],
            );
            boatracePlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [baseBoatracePlaceEntity],
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await useCase.updatePlaceEntityList(
                startDate,
                finishDate,
                ALL_RACE_TYPE_LIST,
            );

            expect(
                placeRepositoryFromStorage.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
