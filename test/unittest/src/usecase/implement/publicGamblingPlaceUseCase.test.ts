import 'reflect-metadata';

import { container } from 'tsyringe';

import { PublicGamblingPlaceUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingPlaceUseCase';
import type { IPlaceUseCase } from '../../../../../lib/src/usecase/interface/IPlaceUseCase';
import type { TestServiceSetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceMock,
} from '../../../../utility/testSetupHelper';
import {
    mockPlaceEntityList,
    testRaceTypeListAll,
    testRaceTypeListWithoutOverseas,
} from '../../mock/common/baseCommonData';
describe('PublicGamblingPlaceUseCase', () => {
    let serviceSetup: TestServiceSetup;
    let useCase: IPlaceUseCase;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(PublicGamblingPlaceUseCase);
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

    describe('updatePlaceDataList', () => {
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
