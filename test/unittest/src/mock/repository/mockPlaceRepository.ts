import type { OldSearchPlaceFilterEntity } from '../../../../../src/repository/entity/filter/oldSearchPlaceFilterEntity';
import type { IPlaceRepository } from '../../../../../src/repository/interface/IPlaceRepository';
import { basePlaceEntity } from '../common/baseCommonData';

export const mockPlaceRepository = (): jest.Mocked<IPlaceRepository> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockImplementation(
                async (searchFilter: OldSearchPlaceFilterEntity) => {
                    const { raceTypeList } = searchFilter;
                    return raceTypeList.map((raceType) =>
                        basePlaceEntity(raceType),
                    );
                },
            ),
        upsertPlaceEntityList: jest.fn().mockImplementation(),
    };
};
