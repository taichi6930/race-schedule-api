import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
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
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../utility/testSetupHelper';
import type { SearchPlaceFilterEntity } from './../../../../lib/src/repository/entity/searchPlaceFilterEntity';

describe('PublicGamblingPlaceDataUseCase-publicGamblingPlaceDataService', () => {
    let repositorySetUp: TestRepositorySetup;
    let service: IPlaceDataService;
    let useCase: IPlaceDataUseCase;

    beforeEach(() => {
        repositorySetUp = setupTestRepositoryMock();

        service = container.resolve(PublicGamblingPlaceDataService);
        container.registerInstance<IPlaceDataService>(
            'PublicGamblingPlaceDataService',
            service,
        );
        useCase = container.resolve(PublicGamblingPlaceDataUseCase);
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
            repositorySetUp.placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
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
            repositorySetUp.placeRepositoryFromStorage.registerPlaceEntityList.mockImplementation(
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
            repositorySetUp.placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
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
            repositorySetUp.jraPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.JRA)],
            );
            repositorySetUp.narPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.NAR)],
            );
            repositorySetUp.keirinPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.KEIRIN)],
            );
            repositorySetUp.autoracePlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.AUTORACE)],
            );
            repositorySetUp.boatracePlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
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
                repositorySetUp.placeRepositoryFromStorage
                    .registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
