import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { IOldPlaceDataService } from '../../../../lib/src/service/interface/IOldPlaceDataService';
import { BoatracePlaceDataUseCase } from '../../../../lib/src/usecase/implement/boatracePlaceDataUseCase';
import {
    baseBoatracePlaceData,
    baseBoatracePlaceEntity,
} from '../../mock/common/baseBoatraceData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';

describe('BoatracePlaceDataUseCase', () => {
    let placeDataService: jest.Mocked<
        IOldPlaceDataService<BoatracePlaceEntity>
    >;
    let useCase: BoatracePlaceDataUseCase;

    beforeEach(() => {
        placeDataService = placeDataServiceMock<BoatracePlaceEntity>();
        container.registerInstance<IOldPlaceDataService<BoatracePlaceEntity>>(
            'BoatracePlaceDataService',
            placeDataService,
        );

        useCase = container.resolve(BoatracePlaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること', async () => {
            const mockPlaceData: BoatracePlaceData[] = [baseBoatracePlaceData];
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
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
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
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
