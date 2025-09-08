import type { SearchCalendarFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepositoryForAWS } from '../../../../../../lib/src/repository/interface/ICalendarRepository';
import { baseCalendarData } from '../common/baseCommonData';

export const mockCalendarRepository =
    (): jest.Mocked<ICalendarRepositoryForAWS> => {
        return {
            getEvents: jest
                .fn()
                .mockImplementation(
                    async (searchFilter: SearchCalendarFilterEntityForAWS) => {
                        return searchFilter.raceTypeList.map((raceType) =>
                            baseCalendarData(raceType),
                        );
                    },
                ),
            upsertEvents: jest.fn(),
            deleteEvents: jest.fn(),
        };
    };
