import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        getEvents: jest.fn(),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
