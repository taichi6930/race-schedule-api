import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { NarPlaceDataUseCase } from '../../../../lib/src/usecase/implement/narPlaceDataUseCase';
import { mockNarPlaceRepositoryFromHtmlImpl } from '../../mock/repository/narPlaceRepositoryFromHtmlImpl';
import { mockNarPlaceRepositoryFromS3Impl } from '../../mock/repository/narPlaceRepositoryFromS3Impl';

describe('NarPlaceDataUseCase', () => {
    let narPlaceRepositoryFromS3Impl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let narPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let useCase: NarPlaceDataUseCase;

    beforeEach(() => {
        // narPlaceRepositoryFromS3Implをコンテナに登録
        narPlaceRepositoryFromS3Impl = mockNarPlaceRepositoryFromS3Impl();
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromS3',
            {
                useValue: narPlaceRepositoryFromS3Impl,
            },
        );

        narPlaceRepositoryFromHtmlImpl = mockNarPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useValue: narPlaceRepositoryFromHtmlImpl,
            },
        );

        // NarPlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(NarPlaceDataUseCase);
    });

    const basePlaceData = new NarPlaceData(
        new Date('2024-06-03 20:10'),
        '大井',
    );

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: NarPlaceData[] = [basePlaceData];

            // モックの戻り値を設定
            narPlaceRepositoryFromS3Impl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<NarPlaceEntity>(mockPlaceData),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockPlaceData);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceData: NarPlaceData[] = [basePlaceData];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            narPlaceRepositoryFromS3Impl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<NarPlaceEntity>(mockPlaceData),
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(
                narPlaceRepositoryFromHtmlImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                narPlaceRepositoryFromS3Impl.registerPlaceList,
            ).toHaveBeenCalled();
        });
    });
});
