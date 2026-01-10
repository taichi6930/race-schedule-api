import type { CalendarDataDto } from '../../domain/calendarData';
import type { OldSearchCalendarFilterEntity } from '../entity/filter/oldSearchCalendarFilterEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface ICalendarRepository {
    fetchEventList: (
        searchFilter: OldSearchCalendarFilterEntity,
    ) => Promise<CalendarDataDto[]>;

    upsertEventList: (raceEntityList: RaceEntity[]) => Promise<void>;

    deleteEventList: (calendarDataList: CalendarDataDto[]) => Promise<void>;
}
