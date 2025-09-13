import type { SearchPlaceFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IRaceRepositoryForAWS } from '../../../../../../lib/src/repository/interface/IRaceRepositoryForAWS';
import type { RaceType } from '../../../../../../src/utility/raceType';
import { baseRaceEntityList } from '../../../../../unittest/src/mock/common/baseCommonData';

export const mockRaceRepositoryForAWS =
    (): jest.Mocked<IRaceRepositoryForAWS> => {
        return {
            fetchRaceEntityList: jest
                .fn()
                .mockImplementation(
                    async (searchFilter: SearchPlaceFilterEntityForAWS) => {
                        const { raceType } = searchFilter;
                        return baseRaceEntityList(raceType);
                    },
                ),
            upsertRaceEntityList: jest
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
