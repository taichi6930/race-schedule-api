import type { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../domain/entity/playerEntity';

/**
 * Player Service Interface
 */
export interface IPlayerService {
    fetchPlayerEntityList: (
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (entityList: PlayerEntity[]) => Promise<void>;
}
