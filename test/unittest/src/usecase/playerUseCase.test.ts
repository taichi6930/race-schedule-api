import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchPlayerFilterEntity } from '../../../../src/repository/entity/filter/searchPlayerFilterEntity';
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
            const searchPlayerFilter = new SearchPlayerFilterEntity(
                testRaceTypeListAll,
            );

            const result =
                await useCase.fetchPlayerEntityList(searchPlayerFilter);

            expect(result).toEqual(mockPlayerEntityList);
        });
    });

    describe('updatePlayerEntityList', () => {
        it('正常に選手データが更新されること', async () => {
            // モックの戻り値を設定
            serviceSetup.placeService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            await useCase.upsertPlayerEntityList(mockPlayerEntityList);

            expect(
                serviceSetup.playerService.upsertPlayerEntityList,
            ).toHaveBeenCalled();
        });
    });
});
