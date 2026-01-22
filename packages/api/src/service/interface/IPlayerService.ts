import type { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../domain/entity/playerEntity';

export interface IPlayerService {
    fetchPlayerEntityList: (
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (entityList: PlayerEntity[]) => Promise<void>;
}
