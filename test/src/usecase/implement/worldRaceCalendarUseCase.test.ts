import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { WorldRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/worldRaceCalendarUseCase';
import { WorldSpecifiedGradeList } from '../../../../lib/src/utility/data/world/worldGradeType';
import {
    baseWorldCalendarData,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('WorldRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService>;
    let raceDataService: jest.Mocked<IRaceDataService>;
    let useCase: WorldRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = calendarServiceMock();
        container.registerInstance<ICalendarService>(
            'PublicGamblingCalendarService',
            calendarService,
        );

        raceDataService = raceDataServiceMock();
        container.registerInstance<IRaceDataService>(
            'PublicGamblingRaceDataService',
            raceDataService,
        );
        useCase = container.resolve(WorldRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateRacesToCalendar', () => {
        it('イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseWorldCalendarData.copy({
                        id: `world2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: WorldRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseWorldRaceEntity.copy({
                        id: `world2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList = {
                world: Array.from({ length: 3 }, (_, i: number) =>
                    baseWorldCalendarData.copy({
                        id: `world2024122920${(i + 6).toXDigits(2)}`,
                    }),
                ),
                jra: [],
                nar: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            };
            const expectRaceEntityList = { world: mockRaceEntityList };

            // モックの戻り値を設定
            calendarService.fetchEvents.mockResolvedValue(mockCalendarDataList);
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                world: mockRaceEntityList,
                jra: [],
                nar: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            });

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WorldSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarService.fetchEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
                ['world'],
            );

            // deleteEventsが呼び出された回数を確認
            expect(calendarService.deleteEvents).toHaveBeenCalledTimes(1);
            expect(calendarService.deleteEvents).toHaveBeenCalledWith(
                expectCalendarDataList,
            );
            expect(calendarService.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarService.upsertEvents).toHaveBeenCalledWith(
                expectRaceEntityList,
            );
        });
    });
});
