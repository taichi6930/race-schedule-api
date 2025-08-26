import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import type { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { PublicGamblingPlaceService } from '../../../../lib/src/service/implement/publicGamblingPlaceService';
import type { IPlaceService } from '../../../../lib/src/service/interface/IPlaceService';
import { PublicGamblingPlaceUseCase } from '../../../../lib/src/usecase/implement/publicGamblingPlaceUseCase';
import type { IPlaceUseCase } from '../../../../lib/src/usecase/interface/IPlaceUseCase';
import { RaceType } from '../../../../lib/src/utility/raceType';
import {
    basePlaceEntity,
    testRaceTypeListAll,
    testRaceTypeListWithoutOverseas,
} from '../../../unittest/src/mock/common/baseCommonData';
import type { TestRepositorySetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../utility/testSetupHelper';

describe('PublicGamblingPlaceDataUseCase-publicGamblingPlaceService', () => {
    let repositorySetup: TestRepositorySetup;
    let service: IPlaceService;
    let useCase: IPlaceUseCase;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();

        service = container.resolve(PublicGamblingPlaceService);
        container.registerInstance<IPlaceService>(
            'PublicGamblingPlaceService',
            service,
        );
        useCase = container.resolve(PublicGamblingPlaceUseCase);
    });

    afterEach(() => {
        clearMocks();
    });

    const mockPlaceEntity = testRaceTypeListWithoutOverseas.map((raceType) =>
        basePlaceEntity(raceType),
    );

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること', async () => {
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
            repositorySetup.placeRepositoryFromStorage.registerPlaceEntityList.mockImplementation(
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

            // モックの戻り値を設定
            repositorySetup.placeRepositoryFromHtml.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    return [basePlaceEntity(searchFilter.raceType)];
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await useCase.updatePlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            expect(
                repositorySetup.placeRepositoryFromStorage
                    .registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
