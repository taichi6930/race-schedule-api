import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { AutoracePlaceDataService } from '../../../../lib/src/service/implement/autoracePlaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseAutoracePlaceEntity } from '../../mock/common/baseAutoraceData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';

describe('AutoracePlaceDataService', () => {
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let placeRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let service: AutoracePlaceDataService;

    beforeEach(() => {
        placeRepositoryFromStorageImpl =
            mockPlaceRepository<AutoracePlaceEntity>();
        container.registerInstance<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            placeRepositoryFromStorageImpl,
        );

        placeRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            placeRepositoryFromHtmlImpl,
        );

        service = container.resolve(AutoracePlaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            // モックの戻り値を設定
            placeRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常に開催場データが取得できること（web）', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            // モックの戻り値を設定
            placeRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('開催場データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            placeRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
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
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
