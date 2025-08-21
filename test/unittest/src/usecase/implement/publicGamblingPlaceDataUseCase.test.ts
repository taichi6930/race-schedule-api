import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceDataUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../../../lib/src/usecase/interface/IPlaceDataUseCase';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { clearMocks, setupTestMock } from '../../../../utility/testSetupHelper';
import { basePlaceEntity } from '../../mock/common/baseCommonData';
import {
    RACE_TYPE_LIST_ALL,
    RACE_TYPE_LIST_WITHOUT_OVERSEAS,
} from './../../../../../lib/src/utility/raceType';
describe('PublicGamblingPlaceUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let useCase: IPlaceDataUseCase;

    const mockPlaceEntityList = RACE_TYPE_LIST_WITHOUT_OVERSEAS.map(
        (raceType) => basePlaceEntity(raceType),
    );

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ placeDataService } = setup);
        useCase = container.resolve(PublicGamblingPlaceDataUseCase);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること', async () => {
            // モックの戻り値を設定
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceEntityList(
                startDate,
                finishDate,
                RACE_TYPE_LIST_WITHOUT_OVERSEAS,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            await useCase.updatePlaceEntityList(
                startDate,
                finishDate,
                RACE_TYPE_LIST_ALL,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(placeDataService.updatePlaceEntityList).toHaveBeenCalled();
        });
    });
});
