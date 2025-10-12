import type { SearchCalendarFilterEntity } from '../../../../../src/repository/entity/filter/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../../src/repository/interface/ICalendarRepository';
import { baseCalendarData } from '../common/baseCommonData';

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        fetchEventList: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchCalendarFilterEntity) => {
                    const { raceTypeList } = searchFilter;
                    return raceTypeList.map((raceType) =>
                        baseCalendarData(raceType),
                    );
                },
            ),
        upsertEventList: jest.fn(),
        deleteEventList: jest.fn(),
    };
};
