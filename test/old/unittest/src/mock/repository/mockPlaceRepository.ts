import type { SearchPlaceFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IPlaceRepositoryForAWS } from '../../../../../../lib/src/repository/interface/IPlaceRepository';
import type { PlaceEntity } from '../../../../../../src/repository/entity/placeEntity';
import { RaceType } from '../../../../../../src/utility/raceType';
import { basePlaceEntity } from '../../../../../unittest/src/mock/common/baseCommonData';

export const mockPlaceRepository = (): jest.Mocked<IPlaceRepositoryForAWS> => {
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
                async (raceType: RaceType, placeEntityList: PlaceEntity[]) => {
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
