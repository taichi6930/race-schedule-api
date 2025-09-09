import type { CommonParameter } from '../../utility/commonParameter';
import type { SearchPlayerFilterEntity } from '../entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../entity/playerEntity';

export interface IPlayerRepository {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
