import type { CalendarData } from '../../../../../../lib/src/domain/calendarData';
import type { ICalendarServiceForAWS } from '../../../../../../lib/src/service/interface/ICalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns モック化されたICalendarServiceインターフェースのインスタンス
 */
export const calendarServiceMock = (): jest.Mocked<ICalendarServiceForAWS> => {
    return {
        fetchEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(Promise.resolve()),
        deleteEvents: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
