import type { IOldCalendarService } from '../../../../../src/service/interface/IOldCalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns モック化されたICalendarServiceインターフェースのインスタンス
 */
export const calendarServiceMock = (): jest.Mocked<IOldCalendarService> => {
    return {
        fetchEvents: jest.fn().mockResolvedValue([]),
        upsertEventList: jest.fn().mockResolvedValue(Promise.resolve()),
        deleteEventList: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
