import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { KeirinRaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinRaceDataUseCase';
import { baseKeirinRaceDataList } from '../../mock/common/baseKeirinData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('KeirinRaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let raceDataService: jest.Mocked<IRaceDataService>;
    let useCase: KeirinRaceDataUseCase;

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

        useCase = container.resolve(KeirinRaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceData: KeirinRaceData[] = baseKeirinRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
