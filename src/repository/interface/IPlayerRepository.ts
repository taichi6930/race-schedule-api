import type { SearchPlayerFilterEntity } from '../entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../entity/playerEntity';

export interface IPlayerRepository {
    fetchPlayerEntityList: (
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (entityList: PlayerEntity[]) => Promise<void>;
}
