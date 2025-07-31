import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { KeirinRaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinRaceDataUseCase';
import {
    baseKeirinPlaceEntity,
    baseKeirinRaceDataList,
    baseKeirinRaceEntityList,
} from '../../mock/common/baseKeirinData';
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

    describe('updateRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockPlaceEntity = {
                jra: [],
                nar: [],
                boatrace: [],
                keirin: [baseKeirinPlaceEntity],
                autorace: [],
            };

            const startDate = new Date('2024-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['GP'],
                locationList: ['平塚'],
            };

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                keirin: baseKeirinRaceEntityList,
                jra: [],
                nar: [],
                world: [],
                boatrace: [],
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
                gradeList: ['GP'],
                locationList: ['平塚'],
            };

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                keirin: baseKeirinRaceEntityList,
                jra: [],
                nar: [],
                world: [],
                boatrace: [],
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
                boatrace: [],
                keirin: [baseKeirinPlaceEntity],
                autorace: [],
            };
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {};

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                keirin: baseKeirinRaceEntityList,
                jra: [],
                nar: [],
                world: [],
                boatrace: [],
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
            const mockRaceData: KeirinRaceData[] = baseKeirinRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
