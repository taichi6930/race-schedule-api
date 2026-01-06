import 'reflect-metadata';

import { container } from 'tsyringe';

import { OldSearchPlaceFilterEntity } from '../../../../src/repository/entity/filter/oldSearchPlaceFilterEntity';
import { OldPlaceService } from '../../../../src/service/implement/oldPlaceService';
import type { IOldPlaceService } from '../../../../src/service/interface/IOldPlaceService';
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

describe('PlaceService', () => {
    let repositorySetup: TestRepositorySetup;
    let service: IOldPlaceService;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();
        service = container.resolve(OldPlaceService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchPlaceEntityList', () => {
        it('正常に開催場データがStorageから取得できること', async () => {
            // モックの戻り値を設定
            repositorySetup.placeRepositoryFromStorage.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const searchPlaceFilter = new OldSearchPlaceFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
                [],
            );

            const result = await service.fetchPlaceEntityList(
                searchPlaceFilter,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });

        it('正常に開催場データがHTMLから取得できること', async () => {
            // モックの戻り値を設定
            repositorySetup.placeRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const searchPlaceFilter = new OldSearchPlaceFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
                [],
            );

            const result = await service.fetchPlaceEntityList(
                searchPlaceFilter,
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });
    });

    describe('updatePlaceEntityList', () => {
        it('正常に開催場データが更新されること', async () => {
            await service.upsertPlaceEntityList(mockPlaceEntityList);

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
