import type { IRaceEntity } from '../../../../../lib/src/repository/entity/iRaceEntity';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';

export const mockCalendarRepository = <R extends IRaceEntity<R>>(): jest.Mocked<
    ICalendarRepository<R>
> => {
    return {
        getEvents: jest.fn(),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
