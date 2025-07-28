import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceUseCase } from '../../../../lib/src/usecase/implement/publicGamblingPlaceUseCase';
import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatracePlaceData,
    baseBoatracePlaceEntity,
} from '../../mock/common/baseBoatraceData';
import {
    baseJraPlaceData,
    baseJraPlaceEntity,
} from '../../mock/common/baseJraData';
import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../mock/common/baseKeirinData';
import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../mock/common/baseNarData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';

describe('PublicGamblingPlaceUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let useCase: PublicGamblingPlaceUseCase;

    beforeEach(() => {
        placeDataService = placeDataServiceMock();
        container.registerInstance<IPlaceDataService>(
            'PublicGamblingPlaceDataService',
            placeDataService,
        );

        useCase = container.resolve(PublicGamblingPlaceUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること', async () => {
            const mockPlaceData = [
                baseJraPlaceData,
                baseNarPlaceData,
                baseKeirinPlaceData,
                baseAutoracePlaceData,
                baseBoatracePlaceData,
            ];

            // モックの戻り値を設定
            placeDataService.fetchPlaceEntityList.mockResolvedValue({
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                keirin: [baseKeirinPlaceEntity],
                autorace: [baseAutoracePlaceEntity],
                boatrace: [baseBoatracePlaceEntity],
            });

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceDataList(
                startDate,
                finishDate,
                ['jra', 'nar', 'keirin', 'autorace', 'boatrace'],
            );

            expect(result).toEqual(mockPlaceData);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            placeDataService.fetchPlaceEntityList.mockResolvedValue({
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                keirin: [baseKeirinPlaceEntity],
                autorace: [baseAutoracePlaceEntity],
                boatrace: [baseBoatracePlaceEntity],
            });

            await useCase.updatePlaceDataList(startDate, finishDate, [
                'jra',
                'nar',
                'keirin',
                'boatrace',
                'autorace',
            ]);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(placeDataService.updatePlaceEntityList).toHaveBeenCalled();
        });
    });
});
