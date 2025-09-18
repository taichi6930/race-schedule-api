import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchRaceFilterEntity } from '../../../../src/repository/entity/filter/searchRaceFilterEntity';
import { RaceService } from '../../../../src/service/implement/raceService';
import type { IRaceService } from '../../../../src/service/interface/IRaceService';
import { DataLocation } from '../../../../src/utility/dataType';
import type { TestRepositorySetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../utility/testSetupHelper';
import {
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../mock/common/baseCommonData';
import { commonParameterMock } from '../mock/common/commonParameterMock';

describe('RaceService', () => {
    let repositorySetup: TestRepositorySetup;
    let service: IRaceService;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();
        service = container.resolve(RaceService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催データがStorageから取得できること', async () => {
            // モックの戻り値を設定
            repositorySetup.raceRepositoryFromStorage.fetchRaceEntityList.mockResolvedValue(
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

            const result = await service.fetchRaceEntityList(
                commonParameterMock(),
                searchRaceFilter,
                DataLocation.Storage,
            );

            expect(result).toBe(mockRaceEntityList);
        });

        it('正常に開催データがWebから取得できること', async () => {
            // モックの戻り値を設定
            repositorySetup.raceRepositoryFromHtml.fetchRaceEntityList.mockResolvedValue(
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

            const result = await service.fetchRaceEntityList(
                commonParameterMock(),
                searchRaceFilter,
                DataLocation.Web,
            );

            expect(result.length).toBe(mockRaceEntityList.length);
            for (const entity of result) {
                expect(mockRaceEntityList).toContain(entity);
            }
        });
    });

    describe('updateRaceEntityList', () => {
        it('正常に開催データが更新されること', async () => {
            await service.upsertRaceEntityList(
                commonParameterMock(),
                mockRaceEntityList,
            );

            expect(
                repositorySetup.raceRepositoryFromHtml.fetchRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                repositorySetup.raceRepositoryFromStorage.upsertRaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
