import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { IRaceEntity } from '../../../../lib/src/repository/entity/iRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns モック化されたICalendarServiceインターフェースのインスタンス
 */
export const calendarServiceMock = <R extends IRaceEntity<R>>(): jest.Mocked<
    ICalendarService<R>
> => {
    return {
        getEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(Promise.resolve()),
        deleteEvents: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
