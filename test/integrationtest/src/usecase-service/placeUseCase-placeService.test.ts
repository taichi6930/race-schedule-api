import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { PlaceService } from '../../../../lib/src/service/implement/placeService';
import type { IPlaceService } from '../../../../lib/src/service/interface/IPlaceService';
import { PlaceUseCase } from '../../../../lib/src/usecase/implement/placeUseCase';
import type { IPlaceUseCase } from '../../../../lib/src/usecase/interface/IPlaceUseCase';
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

describe('placeUseCase-placeService', () => {
    let repositorySetup: TestRepositorySetup;
    let service: IPlaceService;
    let useCase: IPlaceUseCase;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();

        service = container.resolve(PlaceService);
        container.registerInstance<IPlaceService>('PlaceService', service);
        useCase = container.resolve(PlaceUseCase);
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
                    .registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
