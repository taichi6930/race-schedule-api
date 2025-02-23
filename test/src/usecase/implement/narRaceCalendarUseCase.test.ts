import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { NarRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/narRaceCalendarUseCase';
import { NarSpecifiedGradeList } from '../../../../lib/src/utility/data/nar/narGradeType';
import {
    baseNarCalendarData,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('NarRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService<NarRaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<NarRaceEntity, NarPlaceEntity>
    >;
    let useCase: NarRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = CalendarServiceMock<NarRaceEntity>();
        container.registerInstance<ICalendarService<NarRaceEntity>>(
            'NarCalendarService',
            calendarService,
        );

        raceDataService = RaceDataServiceMock<NarRaceEntity, NarPlaceEntity>();
        container.registerInstance<
            IRaceDataService<NarRaceEntity, NarPlaceEntity>
        >('NarRaceDataService', raceDataService);

        useCase = container.resolve(NarRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseNarCalendarData];

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
                    baseNarCalendarData.copy({
                        id: `nar2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: NarRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseNarRaceEntity.copy({
                        id: `nar2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseNarCalendarData.copy({
                        id: `nar2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: NarRaceEntity[] = mockRaceEntityList;

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
                NarSpecifiedGradeList,
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
