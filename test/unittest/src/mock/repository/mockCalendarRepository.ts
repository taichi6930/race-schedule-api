import type { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import { baseCalendarData } from '../common/baseCommonData';

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        getEvents: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchCalendarFilterEntity) => {
                    return searchFilter.raceTypeList.map((raceType) =>
                        baseCalendarData(raceType),
                    );
                },
            ),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
