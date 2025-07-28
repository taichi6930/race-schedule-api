import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { JraPlaceDataService } from '../../../../lib/src/service/implement/jraPlaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseJraPlaceEntity } from '../../mock/common/baseJraData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';

describe('JraPlaceDataService', () => {
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let placeRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let service: JraPlaceDataService;

    beforeEach(() => {
        placeRepositoryFromStorageImpl = mockPlaceRepository<JraPlaceEntity>();
        container.registerInstance<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromStorage',
            placeRepositoryFromStorageImpl,
        );

        placeRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            placeRepositoryFromHtmlImpl,
        );

        service = container.resolve(JraPlaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

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
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

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
