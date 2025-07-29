import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { JraRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/jraRaceCalendarUseCase';
import { JraSpecifiedGradeList } from '../../../../lib/src/utility/data/jra/jraGradeType';
import {
    baseJraCalendarData,
    baseJraRaceEntity,
} from '../../mock/common/baseJraData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('JraRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService>;
    let raceDataService: jest.Mocked<IRaceDataService>;
    let useCase: JraRaceCalendarUseCase;

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

        useCase = container.resolve(JraRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateRacesToCalendar', () => {
        it('イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseJraCalendarData.copy({
                        id: `jra2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: JraRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseJraRaceEntity.copy({
                        id: `jra2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList = {
                jra: Array.from({ length: 3 }, (_, i: number) =>
                    baseJraCalendarData.copy({
                        id: `jra2024122920${(i + 6).toXDigits(2)}`,
                    }),
                ),
                nar: [],
                world: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            };
            const expectRaceEntityList = { jra: mockRaceEntityList };

            // モックの戻り値を設定
            calendarService.fetchEvents.mockResolvedValue(mockCalendarDataList);
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                jra: mockRaceEntityList,
                nar: [],
                world: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            });

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                JraSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarService.fetchEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
                ['jra'],
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
