import type { CalendarData } from '../../../../../lib/src/domain/calendarData';
import type { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import { baseCalendarData } from '../common/baseCommonData';

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        getEvents: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchCalendarFilterEntity) => {
                    const CalendarDataList: CalendarData[] = [];
                    for (const raceType of searchFilter.raceTypeList) {
                        CalendarDataList.push(baseCalendarData(raceType));
                    }
                    return CalendarDataList;
                },
            ),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
