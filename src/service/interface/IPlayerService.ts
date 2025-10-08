import type { SearchPlayerFilterEntity } from '../../repository/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../repository/entity/playerEntity';

export interface IPlayerService {
    fetchPlayerEntityList: (
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (entityList: PlayerEntity[]) => Promise<void>;
}
