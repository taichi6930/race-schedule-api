import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { PlaceServiceForAWS } from '../../../../../../lib/src/service/implement/placeServiceForAWS';
import type { IPlaceServiceForAWS } from '../../../../../../lib/src/service/interface/IPlaceServiceForAWS';
import { DataLocation } from '../../../../../../src/utility/dataType';
import {
    mockPlaceEntityList,
    mockPlaceEntityListMechanicalRacing,
    testRaceTypeListMechanicalRacing,
    testRaceTypeListWithoutOverseas,
} from '../../../../../unittest/src/mock/common/baseCommonData';
import type { TestRepositoryForAWSSetup } from '../../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryForAWSMock,
} from '../../../../../utility/testSetupHelper';

describe('PlaceService', () => {
    let repositorySetup: TestRepositoryForAWSSetup;
    let service: IPlaceServiceForAWS;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryForAWSMock();
        service = container.resolve(PlaceServiceForAWS);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListMechanicalRacing,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntityListMechanicalRacing);
        });

        it('正常に開催場データが取得できること（web）', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListMechanicalRacing,
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntityListMechanicalRacing);
        });

        it('開催場データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            repositorySetup.placeRepositoryFromStorage.fetchPlaceEntityList.mockRejectedValue(
                new Error('開催場データの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            await service.updatePlaceEntityList(mockPlaceEntityList);

            expect(
                repositorySetup.placeRepositoryFromStorage
                    .upsertPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('開催場データの件数が0の場合、Repositoryを呼び出さないこと', async () => {
            await service.updatePlaceEntityList([]);

            expect(
                repositorySetup.placeRepositoryFromStorage
                    .upsertPlaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('開催場データが更新できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            repositorySetup.placeRepositoryFromStorage.upsertPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await expect(
                service.updatePlaceEntityList(mockPlaceEntityList),
            ).rejects.toThrow('開催場データの登録に失敗しました');

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
