import type { CalendarData } from '../../domain/calendarData';
import type { CommonParameter } from '../../utility/cloudFlareEnv';
import type { SearchCalendarFilterEntity } from '../entity/filter/searchCalendarFilterEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface ICalendarRepository {
    getEvents: (
        commonParameter: CommonParameter,
        searchFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    upsertEvents: (
        commonParameter: CommonParameter,
        raceEntityList: RaceEntity[],
    ) => Promise<void>;

    deleteEvents: (
        commonParameter: CommonParameter,
        calendarDataList: CalendarData[],
    ) => Promise<void>;
}
