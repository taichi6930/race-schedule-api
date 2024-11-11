import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// WorldRaceRepositoryFromStorageImplのmockを作成
export const mockWorldRaceRepositoryFromStorageImpl = (): jest.Mocked<
    IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as WorldRaceEntity[]),
        registerRaceList: jest.fn().mockResolvedValue({} as WorldRaceEntity),
    };
};