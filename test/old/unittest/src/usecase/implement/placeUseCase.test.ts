import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceUseCaseForAWS } from '../../../../../../lib/src/usecase/implement/placeUseCase';
import type { IPlaceUseCaseForAWS } from '../../../../../../lib/src/usecase/interface/IPlaceUseCase';
import type { TestServiceSetup } from '../../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceMock,
} from '../../../../../utility/testSetupHelper';
import {
    mockPlaceEntityList,
    testRaceTypeListAll,
    testRaceTypeListWithoutOverseas,
} from '../../mock/common/baseCommonData';
describe('PlaceUseCase', () => {
    let serviceSetup: TestServiceSetup;
    let useCase: IPlaceUseCaseForAWS;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(PlaceUseCaseForAWS);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること', async () => {
            // モックの戻り値を設定
            serviceSetup.placeService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });
    });

    describe('updatePlaceEntityList', () => {
        it('正常に開催場データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            serviceSetup.placeService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            await useCase.updatePlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            expect(
                serviceSetup.placeService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                serviceSetup.placeService.updatePlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
