import type { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// AutoracePlaceRepositoryFromStorageImplのmockを作成
export const mockAutoracePlaceRepositoryFromStorageImpl = (): jest.Mocked<
    IPlaceRepository<AutoracePlaceEntity>
> => {
    return {
        fetchPlaceList: jest.fn().mockResolvedValue([] as AutoracePlaceData[]),
        registerPlaceList: jest.fn().mockResolvedValue({} as AutoracePlaceData),
    };
};