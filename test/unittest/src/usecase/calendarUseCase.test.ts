import 'reflect-metadata';

import { container } from 'tsyringe';

import { RaceType } from '../../../../packages/shared/src/types/raceType';
import type { CalendarDataDto } from '../../../../src/domain/calendarData';
import { OldSearchCalendarFilterEntity } from '../../../../src/repository/entity/filter/oldSearchCalendarFilterEntity';
import { OldCalendarUseCase } from '../../../../src/usecase/implement/oldCalendarUseCase';
import type { IOldCalendarUseCase } from '../../../../src/usecase/interface/IOldCalendarUseCase';
import { toXDigits } from '../../../../src/utility/format';
import { SpecifiedGradeList } from '../../../../src/utility/validateAndType/gradeType';
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
    let useCase: IOldCalendarUseCase;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(OldCalendarUseCase);
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

            const searchCalendarFilter = new OldSearchCalendarFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            const result =
                await useCase.fetchCalendarRaceList(searchCalendarFilter);

            expect(
                serviceSetup.calendarService.fetchEvents,
            ).toHaveBeenCalledWith(searchCalendarFilter);
            expect(result).toEqual(mockCalendarDataList);
        });
    });

    it('イベントが追加・削除されること（複数）', async () => {
        const calendarDataList: CalendarDataDto[] = testRaceTypeListAll.flatMap(
            (raceType) =>
                Array.from({ length: 8 }, (_, i: number) => ({
                    ...baseCalendarData(raceType),
                    id: `${raceType.toLowerCase()}2024122920${toXDigits(i + 1, 2)}`,
                })),
        );

        const mockRaceEntityList = testRaceTypeListAll.flatMap((raceType) =>
            Array.from({ length: 5 }, (_, i: number) =>
                baseRaceEntity(raceType).copy({
                    id: `${raceType.toLowerCase()}2024122920${toXDigits(i + 1, 2)}`,
                }),
            ),
        );

        const expectDeleteCalendarDataList = testRaceTypeListAll.flatMap(
            (raceType) =>
                Array.from({ length: 3 }, (_, i: number) => ({
                    ...baseCalendarData(raceType),
                    id: `${raceType.toLowerCase()}2024122920${toXDigits(i + 6, 2)}`,
                })),
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

        const searchCalendarFilter = new OldSearchCalendarFilterEntity(
            startDate,
            finishDate,
            testRaceTypeListAll,
        );

        await useCase.updateCalendarRaceData(searchCalendarFilter, {
            [RaceType.JRA]: SpecifiedGradeList(RaceType.JRA),
            [RaceType.NAR]: SpecifiedGradeList(RaceType.NAR),
            [RaceType.OVERSEAS]: SpecifiedGradeList(RaceType.OVERSEAS),
            [RaceType.KEIRIN]: SpecifiedGradeList(RaceType.KEIRIN),
            [RaceType.AUTORACE]: SpecifiedGradeList(RaceType.AUTORACE),
            [RaceType.BOATRACE]: SpecifiedGradeList(RaceType.BOATRACE),
        });

        // モックが呼び出されたことを確認
        expect(serviceSetup.calendarService.fetchEvents).toHaveBeenCalledWith(
            searchCalendarFilter,
        );

        // deleteEventListが呼び出された回数を確認
        expect(
            serviceSetup.calendarService.deleteEventList,
        ).toHaveBeenCalledTimes(1);
        expect(
            serviceSetup.calendarService.deleteEventList,
        ).toHaveBeenCalledWith(expectDeleteCalendarDataList);
        expect(
            serviceSetup.calendarService.upsertEventList,
        ).toHaveBeenCalledTimes(1);
        expect(
            serviceSetup.calendarService.upsertEventList,
        ).toHaveBeenCalledWith(expectRaceEntityList);
    });
});
