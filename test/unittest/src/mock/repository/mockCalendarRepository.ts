import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        // raceTypeとsearchFilterを受け取る必要があるため、引数を追加
        getEvents: jest.fn(),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
