import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceDataUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../../../lib/src/usecase/interface/IPlaceDataUseCase';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { clearMocks, setupTestMock } from '../../../../utility/testSetupHelper';
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
    basePlaceEntity,
} from '../../mock/common/baseJraData';
import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../mock/common/baseKeirinData';
import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../mock/common/baseNarData';
describe('PublicGamblingPlaceUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let useCase: IPlaceDataUseCase;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ placeDataService } = setup);
        useCase = container.resolve(PublicGamblingPlaceDataUseCase);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceEntityList', () => {
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
                [RaceType.JRA]: [basePlaceEntity],
                [RaceType.NAR]: [baseNarPlaceEntity],
                [RaceType.OVERSEAS]: [],
                [RaceType.KEIRIN]: [baseKeirinPlaceEntity],
                [RaceType.AUTORACE]: [baseAutoracePlaceEntity],
                [RaceType.BOATRACE]: [baseBoatracePlaceEntity],
            });

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceDataList(
                startDate,
                finishDate,
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.KEIRIN,
                    RaceType.AUTORACE,
                    RaceType.BOATRACE,
                ],
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
                [RaceType.JRA]: [basePlaceEntity],
                [RaceType.NAR]: [baseNarPlaceEntity],
                [RaceType.OVERSEAS]: [],
                [RaceType.KEIRIN]: [baseKeirinPlaceEntity],
                [RaceType.AUTORACE]: [baseAutoracePlaceEntity],
                [RaceType.BOATRACE]: [baseBoatracePlaceEntity],
            });

            await useCase.updatePlaceDataList(startDate, finishDate, [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(placeDataService.updatePlaceEntityList).toHaveBeenCalled();
        });
    });
});
