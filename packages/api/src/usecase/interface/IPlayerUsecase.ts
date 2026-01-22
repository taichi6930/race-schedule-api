import type { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../domain/entity/playerEntity';

/**
 * Player UseCase Interface
 */
export interface IPlayerUseCase {
    fetchPlayerEntityList: (
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (entityList: PlayerEntity[]) => Promise<void>;
}
