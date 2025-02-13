import type { CalendarData } from '../../domain/calendarData';
import type { IRaceEntity } from '../entity/iRaceEntity';
import type { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import type { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import type { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';

/**
 * カレンダーリポジトリインターフェース
 */
export interface ICalendarRepository<R extends IRaceEntity<R>> {
    getEvents: (request: FetchCalendarListRequest) => Promise<CalendarData[]>;

    upsertEvents: (raceEntityList: R[]) => Promise<UpsertCalendarListResponse>;

    deleteEvents: (
        calendarDataList: CalendarData[],
    ) => Promise<DeleteCalendarListResponse>;
}
