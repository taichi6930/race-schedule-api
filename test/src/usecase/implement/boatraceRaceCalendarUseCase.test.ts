import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { BoatraceRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/boatraceRaceCalendarUseCase';
import { BoatraceSpecifiedGradeList } from '../../../../lib/src/utility/data/boatrace/boatraceGradeType';
import {
    baseBoatraceCalendarData,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseBoatraceData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('BoatraceRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService<BoatraceRaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let useCase: BoatraceRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = CalendarServiceMock<BoatraceRaceEntity>();
        container.registerInstance<ICalendarService<BoatraceRaceEntity>>(
            'BoatraceCalendarService',
            calendarService,
        );

        raceDataService = RaceDataServiceMock<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >();
        container.registerInstance<
            IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceDataService', raceDataService);

        useCase = container.resolve(BoatraceRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseBoatraceCalendarData];

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
        it('イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: BoatraceRaceEntity[] = [
                ...Array.from({ length: 5 }, (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
                ),
                ...Array.from({ length: 3 }, (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 6).toXDigits(2)}`,
                        raceData: baseBoatraceRaceEntity.raceData.copy({
                            grade: '一般',
                        }),
                    }),
                ),
            ];

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

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
                BoatraceSpecifiedGradeList,
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
