import 'reflect-metadata';

import { container } from 'tsyringe';

import { OldSearchPlaceFilterEntity } from '../../../../src/repository/entity/filter/oldSearchPlaceFilterEntity';
import { SearchPlaceFilterEntity } from '../../../../src/repository/entity/filter/searchPlaceFilterEntity';
import { OldPlaceUseCase } from '../../../../src/usecase/implement/oldPlaceUsecase';
import type { IOldPlaceUseCase } from '../../../../src/usecase/interface/IOldPlaceUsecase';
import type { TestServiceSetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceMock,
} from '../../../utility/testSetupHelper';
import {
    mockPlaceEntityList,
    testRaceTypeListAll,
} from '../mock/common/baseCommonData';

describe('PlaceUseCase', () => {
    let serviceSetup: TestServiceSetup;
    let useCase: IOldPlaceUseCase;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(OldPlaceUseCase);
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

            const searchPlaceFilter = new SearchPlaceFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
                [],
            );

            const result =
                await useCase.fetchPlaceEntityList(searchPlaceFilter);

            expect(result).toEqual(mockPlaceEntityList);
        });
    });

    describe('updatePlaceEntityList', () => {
        it('正常に開催場データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const searchPlaceFilter = new OldSearchPlaceFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
                [],
            );

            // モックの戻り値を設定
            serviceSetup.placeService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            await useCase.upsertPlaceEntityList(searchPlaceFilter);

            expect(
                serviceSetup.placeService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                serviceSetup.placeService.upsertPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
