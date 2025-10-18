import type { ICalendarService } from '../../../../../src/service/interface/ICalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns モック化されたICalendarServiceインターフェースのインスタンス
 */
export const calendarServiceMock = (): jest.Mocked<ICalendarService> => {
    return {
        fetchEvents: jest.fn().mockResolvedValue([]),
        upsertEventList: jest.fn().mockResolvedValue(Promise.resolve()),
        deleteEventList: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
