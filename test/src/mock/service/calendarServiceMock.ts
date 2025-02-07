import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { IRaceEntity } from '../../../../lib/src/repository/entity/iRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns
 */
export const CalendarServiceMock = <R extends IRaceEntity<R>>(): jest.Mocked<
    ICalendarService<R>
> => {
    return {
        getEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(undefined),
        deleteEvents: jest.fn().mockResolvedValue(undefined),
    };
};
