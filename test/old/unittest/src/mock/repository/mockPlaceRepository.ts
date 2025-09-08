import type { PlaceEntityForAWS } from '../../../../../../lib/src/repository/entity/placeEntity';
import type { SearchPlaceFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IPlaceRepository } from '../../../../../../lib/src/repository/interface/IPlaceRepository';
import { RaceType } from '../../../../../../lib/src/utility/raceType';
import { basePlaceEntity } from '../common/baseCommonData';

export const mockPlaceRepository = (): jest.Mocked<IPlaceRepository> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchPlaceFilterEntityForAWS) => {
                    switch (searchFilter.raceType) {
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.KEIRIN:
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            return [basePlaceEntity(searchFilter.raceType)];
                        }
                    }
                },
            ),
        registerPlaceEntityList: jest
            .fn()
            .mockImplementation(
                async (
                    raceType: RaceType,
                    placeEntityList: PlaceEntityForAWS[],
                ) => {
                    {
                        return {
                            code: 200,
                            message: '',
                            successData: placeEntityList,
                            failureData: [],
                        };
                    }
                },
            ),
    };
};
