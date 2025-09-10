import type { CalendarData } from '../../../../../src/domain/calendarData';
import type { ICalendarService } from '../../../../../src/service/interface/ICalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns モック化されたICalendarServiceインターフェースのインスタンス
 */
export const calendarServiceMock = (): jest.Mocked<ICalendarService> => {
    return {
        fetchEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(Promise.resolve()),
        deleteEvents: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
