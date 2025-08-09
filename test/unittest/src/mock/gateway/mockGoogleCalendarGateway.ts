import type { IOldCalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';

export const mockGoogleCalendarGateway =
    (): jest.Mocked<IOldCalendarGateway> => {
        return {
            fetchCalendarDataList: jest.fn(),
            fetchCalendarData: jest.fn(),
            insertCalendarData: jest.fn(),
            updateCalendarData: jest.fn(),
            deleteCalendarData: jest.fn(),
        };
    };
