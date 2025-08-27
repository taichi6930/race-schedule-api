import type { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { baseRaceEntityList } from '../common/baseCommonData';

export const mockRaceRepository = (): jest.Mocked<IRaceRepository> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    return baseRaceEntityList(searchFilter.raceType);
                },
            ),
        registerRaceEntityList: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
