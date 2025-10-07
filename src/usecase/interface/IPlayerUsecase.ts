import type { SearchPlayerFilterEntity } from '../../repository/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../repository/entity/playerEntity';

// UseCase層
export interface IPlayerUseCase {
    fetchPlayerEntityList: (
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (entityList: PlayerEntity[]) => Promise<void>;
}
