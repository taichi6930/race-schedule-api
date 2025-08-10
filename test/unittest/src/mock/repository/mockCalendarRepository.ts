import type { IRaceEntity } from '../../../../../lib/src/repository/entity/iRaceEntity';
import type {
    ICalendarRepository,
    IOldCalendarRepository,
} from '../../../../../lib/src/repository/interface/ICalendarRepository';

export const mockOldCalendarRepository = <
    R extends IRaceEntity<R>,
>(): jest.Mocked<IOldCalendarRepository<R>> => {
    return {
        getEvents: jest.fn(),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        // raceTypeとsearchFilterを受け取る必要があるため、引数を追加
        getEvents: jest.fn(),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
