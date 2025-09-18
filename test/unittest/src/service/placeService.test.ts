import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../../../../src/repository/entity/filter/searchPlaceFilterEntity';
import { PlaceService } from '../../../../src/service/implement/placeService';
import type { IPlaceService } from '../../../../src/service/interface/IPlaceService';
import { DataLocation } from '../../../../src/utility/dataType';
import type { TestRepositorySetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../utility/testSetupHelper';
import {
    mockPlaceEntityList,
    testRaceTypeListAll,
} from '../mock/common/baseCommonData';
import { commonParameterMock } from '../mock/common/commonParameterMock';

describe('PlaceService', () => {
    let repositorySetup: TestRepositorySetup;
    let service: IPlaceService;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();
        service = container.resolve(PlaceService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchPlaceEntityList', () => {
        it('正常に開催場データが取得できること', async () => {
            // モックの戻り値を設定
            repositorySetup.placeRepositoryFromStorage.fetchPlaceEntityList.mockResolvedValue(
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

            const result = await service.fetchPlaceEntityList(
                commonParameterMock(),
                searchPlaceFilter,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });
    });

    describe('updatePlaceEntityList', () => {
        it('正常に開催場データが更新されること', async () => {
            await service.upsertPlaceEntityList(
                commonParameterMock(),
                mockPlaceEntityList,
            );

            expect(
                repositorySetup.placeRepositoryFromHtml.fetchPlaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                repositorySetup.placeRepositoryFromStorage
                    .upsertPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
