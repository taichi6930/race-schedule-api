import type { IPlaceEntity } from '../../../../lib/src/repository/entity/iPlaceEntity';
import type { IOldPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

export const mockPlaceRepository = <P extends IPlaceEntity<P>>(): jest.Mocked<
    IOldPlaceRepository<P>
> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue(Promise.resolve([])),
        registerPlaceEntityList: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
