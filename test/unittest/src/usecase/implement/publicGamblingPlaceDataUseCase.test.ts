import 'reflect-metadata';

import { container } from 'tsyringe';
import { describe, expect, it } from 'vitest';

import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceDataUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../../../lib/src/usecase/interface/IPlaceDataUseCase';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { clearMocks, setupTestMock } from '../../../../utility/testSetupHelper';
import {
    mockPlaceEntityList,
    testRaceTypeListAll,
    testRaceTypeListWithoutOverseas,
} from '../../mock/common/baseCommonData';
describe('PublicGamblingPlaceUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let useCase: IPlaceDataUseCase;

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
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            await useCase.updatePlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(placeDataService.updatePlaceEntityList).toHaveBeenCalled();
        });
    });
});
