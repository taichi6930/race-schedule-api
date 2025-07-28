import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { BoatracePlaceDataService } from '../../../../lib/src/service/implement/boatracePlaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseBoatracePlaceEntity } from '../../mock/common/baseBoatraceData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';

describe('BoatracePlaceDataService', () => {
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let placeRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let service: BoatracePlaceDataService;

    beforeEach(() => {
        placeRepositoryFromStorageImpl =
            mockPlaceRepository<BoatracePlaceEntity>();
        container.registerInstance<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromStorage',
            placeRepositoryFromStorageImpl,
        );

        placeRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            placeRepositoryFromHtmlImpl,
        );

        service = container.resolve(BoatracePlaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
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
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
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
