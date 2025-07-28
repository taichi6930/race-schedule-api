import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { IOldPlaceDataService } from '../../../../lib/src/service/interface/IOldPlaceDataService';
import { JraPlaceDataUseCase } from '../../../../lib/src/usecase/implement/jraPlaceDataUseCase';
import {
    baseJraPlaceData,
    baseJraPlaceEntity,
} from '../../mock/common/baseJraData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';

describe('JraPlaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IOldPlaceDataService<JraPlaceEntity>>;
    let useCase: JraPlaceDataUseCase;

    beforeEach(() => {
        placeDataService = placeDataServiceMock<JraPlaceEntity>();
        container.registerInstance<IOldPlaceDataService<JraPlaceEntity>>(
            'JraPlaceDataService',
            placeDataService,
        );

        useCase = container.resolve(JraPlaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること', async () => {
            const mockPlaceData: JraPlaceData[] = [baseJraPlaceData];
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

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
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

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
