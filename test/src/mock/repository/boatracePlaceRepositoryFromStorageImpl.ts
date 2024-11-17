import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// BoatracePlaceRepositoryFromStorageImplのmockを作成
export const mockBoatracePlaceRepositoryFromStorageImpl = (): jest.Mocked<
    IPlaceRepository<BoatracePlaceEntity>
> => {
    return {
        fetchPlaceList: jest
            .fn()
            .mockResolvedValue([] as BoatracePlaceEntity[]),
        registerPlaceList: jest
            .fn()
            .mockResolvedValue({} as BoatracePlaceEntity),
    };
};