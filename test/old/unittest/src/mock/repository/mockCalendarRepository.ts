import type { SearchCalendarFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepositoryForAWS } from '../../../../../../lib/src/repository/interface/ICalendarRepository';
import { baseCalendarData } from '../../../../../unittest/src/mock/common/baseCommonData';

export const mockCalendarRepositoryForAWS =
    (): jest.Mocked<ICalendarRepositoryForAWS> => {
        return {
            getEvents: jest
                .fn()
                .mockImplementation(
                    async (searchFilter: SearchCalendarFilterEntityForAWS) => {
                        const { raceTypeList } = searchFilter;
                        return raceTypeList.map((raceType) =>
                            baseCalendarData(raceType),
                        );
                    },
                ),
            upsertEvents: jest.fn(),
            deleteEvents: jest.fn(),
        };
    };
