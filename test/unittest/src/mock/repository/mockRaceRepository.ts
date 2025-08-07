import type { IPlaceEntity } from '../../../../../lib/src/repository/entity/iPlaceEntity';
import type { IRaceEntity } from '../../../../../lib/src/repository/entity/iRaceEntity';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';

export const mockRaceRepository = <
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
>(): jest.Mocked<IRaceRepository<R, P>> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue(Promise.resolve([])),
        registerRaceEntityList: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
