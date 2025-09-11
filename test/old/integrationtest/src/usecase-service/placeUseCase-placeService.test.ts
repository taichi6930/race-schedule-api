import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { PlaceServiceForAWS } from '../../../../../lib/src/service/implement/placeService';
import type { IPlaceServiceForAWS } from '../../../../../lib/src/service/interface/IPlaceService';
import { PlaceUseCaseForAWS } from '../../../../../lib/src/usecase/implement/placeUseCase';
import type { IPlaceUseCaseForAWS } from '../../../../../lib/src/usecase/interface/IPlaceUseCase';
import {
    basePlaceEntity,
    testRaceTypeListAll,
    testRaceTypeListWithoutOverseas,
} from '../../../../unittest/src/mock/common/baseCommonData';
import type { TestRepositoryForAWSSetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryForAWSMock,
} from '../../../../utility/testSetupHelper';

describe('placeUseCase-placeService', () => {
    let repositorySetup: TestRepositoryForAWSSetup;
    let service: IPlaceServiceForAWS;
    let useCase: IPlaceUseCaseForAWS;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryForAWSMock();

        service = container.resolve(PlaceServiceForAWS);
        container.registerInstance<IPlaceServiceForAWS>(
            'PlaceService',
            service,
        );
        useCase = container.resolve(PlaceUseCaseForAWS);
    });

    afterEach(() => {
        clearMocks();
    });

    const mockPlaceEntity = testRaceTypeListWithoutOverseas.map((raceType) =>
        basePlaceEntity(raceType),
    );

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること', async () => {
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
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await useCase.updatePlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            expect(
                repositorySetup.placeRepositoryFromStorage
                    .upsertPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
