import type { IRaceEntity } from '../../../../../lib/src/repository/entity/iRaceEntity';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';

export const mockRaceRepository = <R extends IRaceEntity<R>>(): jest.Mocked<
    IRaceRepository<R>
> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue(Promise.resolve([])),
        registerRaceEntityList: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
