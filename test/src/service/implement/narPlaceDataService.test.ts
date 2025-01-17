import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { NarPlaceDataService } from '../../../../lib/src/service/implement/narPlaceDataService';
import { baseNarPlaceEntity } from '../../mock/common/baseNarData';
import { mockNarPlaceRepositoryFromHtmlImpl } from '../../mock/repository/narPlaceRepositoryFromHtmlImpl';
import { mockNarPlaceRepositoryFromStorageImpl } from '../../mock/repository/narPlaceRepositoryFromStorageImpl';

describe('NarPlaceDataService', () => {
    let narPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let narPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let service: NarPlaceDataService;

    beforeEach(() => {
        // narPlaceRepositoryFromStorageImplをコンテナに登録
        narPlaceRepositoryFromStorageImpl =
            mockNarPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromStorage',
            {
                useValue: narPlaceRepositoryFromStorageImpl,
            },
        );

        narPlaceRepositoryFromHtmlImpl = mockNarPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useValue: narPlaceRepositoryFromHtmlImpl,
            },
        );

        // NarPlaceCalendarServiceをコンテナから取得
        service = container.resolve(NarPlaceDataService);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること(storage)', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

            // モックの戻り値を設定
            narPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<NarPlaceEntity>(mockPlaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常にレースデータが取得できること（web）', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

            // モックの戻り値を設定
            narPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<NarPlaceEntity>(mockPlaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                'web',
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            narPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

            // モックの戻り値を設定
            narPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<NarPlaceEntity>(mockPlaceEntity),
            );

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                narPlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('件数0の場合、エラーが発生すること', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [];

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('競馬場データが取得できない場合、エラーが発生すること', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];
            // モックの戻り値を設定（エラーが発生するように設定）
            narPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('競馬場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
