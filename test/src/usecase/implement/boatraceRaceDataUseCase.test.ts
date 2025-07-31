import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { BoatraceRaceDataUseCase } from '../../../../lib/src/usecase/implement/boatraceRaceDataUseCase';
import {
    baseBoatracePlaceEntity,
    baseBoatraceRaceDataList,
    baseBoatraceRaceEntityList,
} from '../../mock/common/baseBoatraceData';
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

    describe('updateRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockPlaceEntity = {
                jra: [],
                nar: [],
                keirin: [],
                boatrace: [baseBoatracePlaceEntity],
                autorace: [],
            };

            const startDate = new Date('2024-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['SG'],
                locationList: ['平和島'],
            };

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                boatrace: baseBoatraceRaceEntityList,
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                autorace: [],
            });
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });

        it('開催場がない時、正常にレース開催データが更新されないこと', async () => {
            const mockPlaceEntity = {
                jra: [],
                nar: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            };
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['SG'],
                locationList: ['平和島'],
            };

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                boatrace: baseBoatraceRaceEntityList,
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                autorace: [],
            });
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).not.toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).not.toHaveBeenCalled();
        });

        it('検索条件がなく、正常にレース開催データが更新されること', async () => {
            const mockPlaceEntity = {
                jra: [],
                nar: [],
                keirin: [],
                boatrace: [baseBoatracePlaceEntity],
                autorace: [],
            };
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {};

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                boatrace: baseBoatraceRaceEntityList,
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                autorace: [],
            });
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceData: BoatraceRaceData[] = baseBoatraceRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
