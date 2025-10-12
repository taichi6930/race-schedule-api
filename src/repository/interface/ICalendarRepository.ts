import type { CalendarData } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../entity/filter/searchCalendarFilterEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface ICalendarRepository {
    fetchEventList: (
        searchFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    upsertEventList: (raceEntityList: RaceEntity[]) => Promise<void>;

    deleteEventList: (calendarDataList: CalendarData[]) => Promise<void>;
}
