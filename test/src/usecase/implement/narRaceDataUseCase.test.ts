import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { NarRaceDataUseCase } from '../../../../lib/src/usecase/implement/narRaceDataUseCase';
import { baseNarRaceDataList } from '../../mock/common/baseNarData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('NarRaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let raceDataService: jest.Mocked<IRaceDataService>;
    let useCase: NarRaceDataUseCase;

    beforeEach(() => {
        placeDataService = placeDataServiceMock();
        container.registerInstance<IPlaceDataService>(
            'PublicGamblingPlaceDataService',
            placeDataService,
        );
        raceDataService = raceDataServiceMock();
        container.registerInstance<IRaceDataService>(
            'PublicGamblingRaceDataService',
            raceDataService,
        );

        useCase = container.resolve(NarRaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceData: NarRaceData[] = baseNarRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
