import type { SearchPlaceFilterEntity } from '../../../../../src/repository/entity/filter/searchPlaceFilterEntity';
import type { IPlaceRepository } from '../../../../../src/repository/interface/IPlaceRepository';
import { basePlaceEntity } from '../common/baseCommonData';

export const mockPlaceRepository = (): jest.Mocked<IPlaceRepository> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    const { raceTypeList } = searchFilter;
                    return raceTypeList.map((raceType) =>
                        basePlaceEntity(raceType),
                    );
                },
            ),
        fetchPlaceEntityListV2: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    const { raceTypeList } = searchFilter;
                    return raceTypeList.map((raceType) =>
                        basePlaceEntity(raceType),
                    );
                },
            ),
        upsertPlaceEntityList: jest.fn().mockImplementation(),
    };
};
