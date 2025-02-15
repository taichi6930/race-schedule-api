import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { WorldRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/worldRaceCalendarUseCase';
import { WorldSpecifiedGradeList } from '../../../../lib/src/utility/data/world/worldGradeType';
import {
    baseWorldCalendarData,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('WorldRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService<WorldRaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<WorldRaceEntity, WorldPlaceEntity>
    >;
    let useCase: WorldRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = CalendarServiceMock<WorldRaceEntity>();
        container.register<ICalendarService<WorldRaceEntity>>(
            'WorldCalendarService',
            {
                useValue: calendarService,
            },
        );
        raceDataService = RaceDataServiceMock<
            WorldRaceEntity,
            WorldPlaceEntity
        >();
        container.register<IRaceDataService<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceDataService',
            {
                useValue: raceDataService,
            },
        );

        useCase = container.resolve(WorldRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseWorldCalendarData];

            // モックの戻り値を設定
            calendarService.getEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.getRacesFromCalendar(
                startDate,
                finishDate,
            );

            expect(calendarService.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );
            expect(result).toEqual(mockCalendarData);
        });
    });

    describe('updateRacesToCalendar', () => {
        it('CalendarList、RaceListもあり、IDが被らない場合、イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseWorldCalendarData.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: WorldRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseWorldRaceEntity.copy({
                        id: `world2024122921${i.toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;
            const expectRaceEntityList: WorldRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarService.getEvents.mockResolvedValue(mockCalendarDataList);
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WorldSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarService.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
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

        it('CalendarList、RaceListもあり、IDが複数被る場合、イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseWorldCalendarData.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: WorldRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseWorldRaceEntity.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseWorldCalendarData.copy({
                        id: `world2024122920${(i + 5).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: WorldRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarService.getEvents.mockResolvedValue(mockCalendarDataList);
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WorldSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarService.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
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
