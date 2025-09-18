import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../src/domain/calendarData';
import { SearchCalendarFilterEntity } from '../../../../src/repository/entity/filter/searchCalendarFilterEntity';
import { CalendarUseCase } from '../../../../src/usecase/implement/calendarUseCase';
import type { ICalendarUseCase } from '../../../../src/usecase/interface/ICalendarUseCase';
import { RaceType } from '../../../../src/utility/raceType';
import { SpecifiedGradeList } from '../../../../src/utility/validateAndType/gradeType';
import { commonParameterMock } from '../../../old/unittest/src/mock/common/commonParameterMock';
import type { TestServiceSetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceMock,
} from '../../../utility/testSetupHelper';
import {
    baseCalendarData,
    baseRaceEntity,
    mockCalendarDataList,
    testRaceTypeListAll,
} from '../mock/common/baseCommonData';

describe('RaceCalendarUseCase', () => {
    let serviceSetup: TestServiceSetup;
    let useCase: ICalendarUseCase;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(CalendarUseCase);
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

            const searchCalendarFilter = new SearchCalendarFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            const commonParameter = commonParameterMock();
            const result = await useCase.fetchCalendarRaceList(
                commonParameter,
                searchCalendarFilter,
            );

            expect(
                serviceSetup.calendarService.fetchEvents,
            ).toHaveBeenCalledWith(commonParameter, searchCalendarFilter);
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

        serviceSetup.raceService.fetchRaceEntityList.mockResolvedValue(
            mockRaceEntityList,
        );

        const startDate = new Date('2024-02-01');
        const finishDate = new Date('2024-02-29');

        const commonParameter = commonParameterMock();
        const searchCalendarFilter = new SearchCalendarFilterEntity(
            startDate,
            finishDate,
            testRaceTypeListAll,
        );

        await useCase.updateCalendarRaceData(
            commonParameter,
            searchCalendarFilter,
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
            commonParameter,
            searchCalendarFilter,
        );

        // deleteEventsが呼び出された回数を確認
        expect(serviceSetup.calendarService.deleteEvents).toHaveBeenCalledTimes(
            1,
        );
        expect(serviceSetup.calendarService.deleteEvents).toHaveBeenCalledWith(
            commonParameter,
            expectDeleteCalendarDataList,
        );
        expect(serviceSetup.calendarService.upsertEvents).toHaveBeenCalledTimes(
            1,
        );
        expect(serviceSetup.calendarService.upsertEvents).toHaveBeenCalledWith(
            commonParameter,
            expectRaceEntityList,
        );
        expect(true).toBe(true);
    });
});
