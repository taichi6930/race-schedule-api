import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../../../../src/repository/entity/filter/searchPlaceFilterEntity';
import { PlayerUseCase } from '../../../../src/usecase/implement/playerUsecase';
import type { IPlayerUseCase } from '../../../../src/usecase/interface/IPlayerUsecase';
import type { TestServiceSetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceMock,
} from '../../../utility/testSetupHelper';
import {
    mockPlaceEntityList,
    mockPlayerEntityList,
    testRaceTypeListAll,
} from '../mock/common/baseCommonData';
import { commonParameterMock } from '../mock/common/commonParameterMock';

describe('PlayerUseCase', () => {
    let serviceSetup: TestServiceSetup;
    let useCase: IPlayerUseCase;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(PlayerUseCase);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchPlayerEntityList', () => {
        it('正常に選手データが取得できること', async () => {
            // モックの戻り値を設定
            serviceSetup.playerService.fetchPlayerEntityList.mockResolvedValue(
                mockPlayerEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const searchPlaceFilter = new SearchPlaceFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
                [],
            );

            const result = await useCase.fetchPlayerEntityList(
                commonParameterMock(),
                searchPlaceFilter,
            );

            expect(result).toEqual(mockPlayerEntityList);
        });
    });

    describe('updatePlayerEntityList', () => {
        it('正常に選手データが更新されること', async () => {
            // モックの戻り値を設定
            serviceSetup.placeService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            await useCase.upsertPlayerEntityList(
                commonParameterMock(),
                mockPlayerEntityList,
            );

            expect(
                serviceSetup.playerService.upsertPlayerEntityList,
            ).toHaveBeenCalled();
        });
    });
});
