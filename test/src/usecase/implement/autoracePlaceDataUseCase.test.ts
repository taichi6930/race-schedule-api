import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { AutoracePlaceDataUseCase } from '../../../../lib/src/usecase/implement/autoracePlaceDataUseCase';
import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
} from '../../mock/common/baseAutoraceData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';

describe('AutoracePlaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService<AutoracePlaceEntity>>;
    let useCase: AutoracePlaceDataUseCase;

    beforeEach(() => {
        placeDataService = placeDataServiceMock<AutoracePlaceEntity>();
        container.registerInstance<IPlaceDataService<AutoracePlaceEntity>>(
            'AutoracePlaceDataService',
            placeDataService,
        );

        useCase = container.resolve(AutoracePlaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること', async () => {
            const mockPlaceData: AutoracePlaceData[] = [baseAutoracePlaceData];
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
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
        it('正常に開催場データが更新されること', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
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
