import type { CalendarData } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../entity/filter/searchCalendarFilterEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface ICalendarRepository {
    getEvents: (
        searchFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    upsertEvents: (raceEntityList: RaceEntity[]) => Promise<void>;

    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
