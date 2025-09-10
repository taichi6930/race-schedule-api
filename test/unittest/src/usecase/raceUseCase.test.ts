import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchRaceFilterEntity } from '../../../../src/repository/entity/filter/searchRaceFilterEntity';
import { RaceUseCase } from '../../../../src/usecase/implement/raceUsecase';
import type { IRaceUseCase } from '../../../../src/usecase/interface/IRaceUsecase';
import { commonParameterMock } from '../../../old/unittest/src/mock/common/commonParameterMock';
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
    let useCase: IRaceUseCase;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(RaceUseCase);
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

            const result = await useCase.fetchRaceEntityList(
                commonParameterMock(),
                searchRaceFilter,
            );

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
                commonParameterMock(),
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
