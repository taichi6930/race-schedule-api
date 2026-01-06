import type { OldSearchCalendarFilterEntity } from '../../../../../src/repository/entity/filter/oldSearchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../../src/repository/interface/ICalendarRepository';
import { baseCalendarData } from '../common/baseCommonData';

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        fetchEventList: jest
            .fn()
            .mockImplementation(
                async (searchFilter: OldSearchCalendarFilterEntity) => {
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
