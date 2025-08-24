import 'reflect-metadata';

import { afterEach } from 'node:test';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { PublicGamblingCalendarUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingCalendarUseCase';
import type { IRaceCalendarUseCase } from '../../../../../lib/src/usecase/interface/IRaceCalendarUseCase';
import { SpecifiedGradeList } from '../../../../../lib/src/utility/data/common/gradeType';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestServiceSetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceMock,
} from '../../../../utility/testSetupHelper';
import {
    baseCalendarData,
    baseRaceEntity,
    mockCalendarDataList,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';

describe('PublicGamblingRaceCalendarUseCase', () => {
    let serviceSetup: TestServiceSetup;
    let useCase: IRaceCalendarUseCase;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(PublicGamblingCalendarUseCase);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            // モックの戻り値を設定
            serviceSetup.calendarService.fetchEvents.mockResolvedValue(
                mockCalendarDataList,
            );

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.fetchRacesFromCalendar(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            expect(
                serviceSetup.calendarService.fetchEvents,
            ).toHaveBeenCalledWith(startDate, finishDate, testRaceTypeListAll);
            expect(result).toEqual(mockCalendarDataList);
        });
    });

    it('イベントが追加・削除されること（複数）', async () => {
        const calendarDataList: CalendarData[] = testRaceTypeListAll.flatMap(
            (raceType) =>
                Array.from({ length: 8 }, (_, i: number) =>
                    baseCalendarData(raceType).copy({
                        id: `${raceType.toLowerCase()}2024122920${(i + 1).toXDigits(2)}`,
                    }),
                ),
        );

        const mockRaceEntityList = testRaceTypeListAll.flatMap((raceType) =>
            Array.from({ length: 5 }, (_, i: number) =>
                baseRaceEntity(raceType).copy({
                    id: `${raceType.toLowerCase()}2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
        );

        const expectDeleteCalendarDataList = testRaceTypeListAll.flatMap(
            (raceType) =>
                Array.from({ length: 3 }, (_, i: number) =>
                    baseCalendarData(raceType).copy({
                        id: `${raceType.toLowerCase()}2024122920${(i + 6).toXDigits(2)}`,
                    }),
                ),
        );
        const expectRaceEntityList = mockRaceEntityList;

        // モックの戻り値を設定
        serviceSetup.calendarService.fetchEvents.mockResolvedValue(
            calendarDataList,
        );

        serviceSetup.raceDataService.fetchRaceEntityList.mockResolvedValue(
            mockRaceEntityList,
        );

        const startDate = new Date('2024-02-01');
        const finishDate = new Date('2024-02-29');

        await useCase.updateRacesToCalendar(
            startDate,
            finishDate,
            testRaceTypeListAll,
            {
                [RaceType.JRA]: SpecifiedGradeList(RaceType.JRA),
                [RaceType.NAR]: SpecifiedGradeList(RaceType.NAR),
                [RaceType.OVERSEAS]: SpecifiedGradeList(RaceType.OVERSEAS),
                [RaceType.KEIRIN]: SpecifiedGradeList(RaceType.KEIRIN),
                [RaceType.AUTORACE]: SpecifiedGradeList(RaceType.AUTORACE),
                [RaceType.BOATRACE]: SpecifiedGradeList(RaceType.BOATRACE),
            },
        );

        // モックが呼び出されたことを確認
        expect(serviceSetup.calendarService.fetchEvents).toHaveBeenCalledWith(
            startDate,
            finishDate,
            testRaceTypeListAll,
        );

        // deleteEventsが呼び出された回数を確認
        expect(serviceSetup.calendarService.deleteEvents).toHaveBeenCalledTimes(
            1,
        );
        expect(serviceSetup.calendarService.deleteEvents).toHaveBeenCalledWith(
            expectDeleteCalendarDataList,
        );
        expect(serviceSetup.calendarService.upsertEvents).toHaveBeenCalledTimes(
            1,
        );
        expect(serviceSetup.calendarService.upsertEvents).toHaveBeenCalledWith(
            expectRaceEntityList,
        );
    });
});
