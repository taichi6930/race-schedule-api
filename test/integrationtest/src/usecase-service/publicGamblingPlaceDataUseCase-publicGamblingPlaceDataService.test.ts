import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { PublicGamblingPlaceDataService } from '../../../../lib/src/service/implement/publicGamblingPlaceDataService';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceDataUseCase } from '../../../../lib/src/usecase/implement/publicGamblingPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../../lib/src/usecase/interface/IPlaceDataUseCase';
import { RaceType } from '../../../../lib/src/utility/raceType';
import {
    basePlaceEntity,
    testRaceTypeListAll,
    testRaceTypeListWithoutOverseas,
} from '../../../unittest/src/mock/common/baseCommonData';
import type { TestRepositorySetup } from '../../../utility/testSetupHelper';
import { setupTestRepositoryMock } from '../../../utility/testSetupHelper';
import type { SearchPlaceFilterEntity } from './../../../../lib/src/repository/entity/searchPlaceFilterEntity';

describe('PublicGamblingPlaceDataUseCase-publicGamblingPlaceDataService', () => {
    let placeRepositoryFromStorage: jest.Mocked<IPlaceRepository>;
    let jraPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let narPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let keirinPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let boatracePlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let autoracePlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let service: IPlaceDataService;
    let useCase: IPlaceDataUseCase;

    beforeEach(() => {
        const setup: TestRepositorySetup = setupTestRepositoryMock();
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

    const mockPlaceEntity = testRaceTypeListWithoutOverseas.map((raceType) =>
        basePlaceEntity(raceType),
    );

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
                            return [basePlaceEntity(searchFilter.raceType)];
                        }
                    }
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListAll,
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
                            return [basePlaceEntity(searchFilter.raceType)];
                        }
                    }
                },
            );

            // モックの戻り値を設定
            jraPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue([
                basePlaceEntity(RaceType.JRA),
            ]);
            narPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue([
                basePlaceEntity(RaceType.NAR),
            ]);
            keirinPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.KEIRIN)],
            );
            autoracePlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.AUTORACE)],
            );
            boatracePlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.BOATRACE)],
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await useCase.updatePlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            expect(
                placeRepositoryFromStorage.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
