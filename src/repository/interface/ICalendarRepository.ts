import type { CalendarData } from '../../domain/calendarData';
import type { OldSearchCalendarFilterEntity } from '../entity/filter/oldSearchCalendarFilterEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface ICalendarRepository {
    fetchEventList: (
        searchFilter: OldSearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    upsertEventList: (raceEntityList: RaceEntity[]) => Promise<void>;

    deleteEventList: (calendarDataList: CalendarData[]) => Promise<void>;
}
