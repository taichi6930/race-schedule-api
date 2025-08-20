import type { CalendarData } from '../../../../../lib/src/domain/calendarData';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import type { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseCalendarData } from '../common/baseCommonData';

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        getEvents: jest
            .fn()
            .mockImplementation(async (raceTypeList: RaceType[]) => {
                const CalendarDataList: CalendarData[] = [];
                for (const raceType of raceTypeList) {
                    if (raceTypeList.includes(raceType)) {
                        CalendarDataList.push(baseCalendarData(raceType));
                    }
                }
                return CalendarDataList;
            }),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
