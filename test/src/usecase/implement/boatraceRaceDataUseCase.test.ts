import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { BoatraceRaceDataUseCase } from '../../../../lib/src/usecase/implement/boatraceRaceDataUseCase';
import { baseBoatraceRaceDataList } from '../../mock/common/baseBoatraceData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('BoatraceRaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let raceDataService: jest.Mocked<IRaceDataService>;
    let useCase: BoatraceRaceDataUseCase;

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

        useCase = container.resolve(BoatraceRaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceData: BoatraceRaceData[] = baseBoatraceRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
