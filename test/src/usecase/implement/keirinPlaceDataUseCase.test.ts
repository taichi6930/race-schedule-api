import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { KeirinPlaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinPlaceDataUseCase';
import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../mock/common/baseKeirinData';
import { PlaceDataServiceMock } from '../../mock/service/placeDataServiceMock';

describe('KeirinPlaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService<KeirinPlaceEntity>>;
    let useCase: KeirinPlaceDataUseCase;

    beforeEach(() => {
        // PlaceDataServiceをコンテナに登録
        placeDataService = PlaceDataServiceMock<KeirinPlaceEntity>();
        container.register<IPlaceDataService<KeirinPlaceEntity>>(
            'KeirinPlaceDataService',
            {
                useValue: placeDataService,
            },
        );

        // PlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(KeirinPlaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: KeirinPlaceData[] = [baseKeirinPlaceData];
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            // モックの戻り値を設定
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
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
        it('正常に競輪場データが更新されること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(placeDataService.updatePlaceEntityList).toHaveBeenCalled();
        });
    });
});
