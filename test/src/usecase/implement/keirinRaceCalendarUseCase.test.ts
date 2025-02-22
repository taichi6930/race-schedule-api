import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { KeirinRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/keirinRaceCalendarUseCase';
import { KeirinSpecifiedGradeList } from '../../../../lib/src/utility/data/keirin/keirinGradeType';
import {
    baseKeirinCalendarData,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('KeirinRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService<KeirinRaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let useCase: KeirinRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = CalendarServiceMock<KeirinRaceEntity>();
        container.register<ICalendarService<KeirinRaceEntity>>(
            'KeirinCalendarService',
            {
                useValue: calendarService,
            },
        );

        raceDataService = RaceDataServiceMock<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >();
        container.register<
            IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceDataService', {
            useValue: raceDataService,
        });

        useCase = container.resolve(KeirinRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseKeirinCalendarData];

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
                    baseKeirinCalendarData.copy({
                        id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: KeirinRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseKeirinRaceEntity.copy({
                        id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseKeirinCalendarData.copy({
                        id: `keirin2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: KeirinRaceEntity[] = mockRaceEntityList;

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
                KeirinSpecifiedGradeList,
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
