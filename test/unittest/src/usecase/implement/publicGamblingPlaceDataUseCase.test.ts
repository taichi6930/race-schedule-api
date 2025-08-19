import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceDataUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../../../lib/src/usecase/interface/IPlaceDataUseCase';
import {
    ALL_RACE_TYPE_LIST,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { clearMocks, setupTestMock } from '../../../../utility/testSetupHelper';
import { baseAutoracePlaceEntity } from '../../mock/common/baseAutoraceData';
import { baseBoatracePlaceEntity } from '../../mock/common/baseBoatraceData';
import { baseJraPlaceEntity } from '../../mock/common/baseJraData';
import { baseKeirinPlaceEntity } from '../../mock/common/baseKeirinData';
import { baseNarPlaceEntity } from '../../mock/common/baseNarData';
describe('PublicGamblingPlaceUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let useCase: IPlaceDataUseCase;

    const mockPlaceEntityList = [
        baseJraPlaceEntity,
        baseNarPlaceEntity,
        baseKeirinPlaceEntity,
        baseAutoracePlaceEntity,
        baseBoatracePlaceEntity,
    ];

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
            // モックの戻り値を設定
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceEntityList(
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

            expect(result).toEqual(mockPlaceEntityList);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            placeDataService.fetchPlaceEntityList.mockResolvedValue([
                baseJraPlaceEntity,
                baseNarPlaceEntity,
                baseKeirinPlaceEntity,
                baseAutoracePlaceEntity,
                baseBoatracePlaceEntity,
            ]);

            await useCase.updatePlaceEntityList(
                startDate,
                finishDate,
                ALL_RACE_TYPE_LIST,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(placeDataService.updatePlaceEntityList).toHaveBeenCalled();
        });
    });
});
