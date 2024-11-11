import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// AutoracePlaceRepositoryFromHtmlImplのmockを作成
export const mockAutoracePlaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IPlaceRepository<AutoracePlaceEntity>
> => {
    return {
        fetchPlaceList: jest
            .fn()
            .mockResolvedValue([] as AutoracePlaceEntity[]),
        registerPlaceList: jest
            .fn()
            .mockResolvedValue({} as AutoracePlaceEntity),
    };
};