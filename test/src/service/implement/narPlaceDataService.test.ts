import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { NarPlaceDataService } from '../../../../lib/src/service/implement/narPlaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseNarPlaceEntity } from '../../mock/common/baseNarData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';

describe('NarPlaceDataService', () => {
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let placeRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let service: NarPlaceDataService;

    beforeEach(() => {
        placeRepositoryFromStorageImpl = mockPlaceRepository<NarPlaceEntity>();
        container.registerInstance<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromStorage',
            placeRepositoryFromStorageImpl,
        );

        placeRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            placeRepositoryFromHtmlImpl,
        );

        service = container.resolve(NarPlaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

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
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

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
