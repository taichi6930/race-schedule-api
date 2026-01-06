import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchRaceFilterEntity } from '../../../../src/repository/entity/filter/searchRaceFilterEntity';
import { OldRaceUseCase } from '../../../../src/usecase/implement/oldRaceUsecase';
import type { IOldRaceUseCase } from '../../../../src/usecase/interface/IOldRaceUsecase';
import type { TestServiceSetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceMock,
} from '../../../utility/testSetupHelper';
import {
    mockPlaceEntityList,
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../mock/common/baseCommonData';

describe('RaceUseCase', () => {
    let serviceSetup: TestServiceSetup;
    let useCase: IOldRaceUseCase;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(OldRaceUseCase);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催データが取得できること', async () => {
            // モックの戻り値を設定
            serviceSetup.raceService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const searchRaceFilter = new SearchRaceFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
                [],
                [],
                [],
            );

            const result = await useCase.fetchRaceEntityList(searchRaceFilter);

            expect(result).toEqual(mockRaceEntityList);
        });
    });

    describe('updatePlaceEntityList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');
            serviceSetup.placeService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );
            // モックの戻り値を設定
            serviceSetup.raceService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );
            await useCase.upsertRaceEntityList(
                new SearchRaceFilterEntity(
                    startDate,
                    finishDate,
                    testRaceTypeListAll,
                    [],
                    [],
                    [],
                ),
            );
            expect(
                serviceSetup.placeService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                serviceSetup.raceService.fetchRaceEntityList,
            ).toHaveBeenCalled();
            expect(
                serviceSetup.raceService.upsertRaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
