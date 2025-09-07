import type { SearchPlaceFilterEntityForAWS } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import type { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceEntityList } from '../common/baseCommonData';

export const mockRaceRepository = (): jest.Mocked<IRaceRepository> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchPlaceFilterEntityForAWS) => {
                    return baseRaceEntityList(searchFilter.raceType);
                },
            ),
        registerRaceEntityList: jest
            .fn()
            .mockImplementation(async (raceType: RaceType) => {
                return {
                    code: 200,
                    message: 'OK',
                    successData: baseRaceEntityList(raceType),
                    failureData: [],
                };
            }),
    };
};
