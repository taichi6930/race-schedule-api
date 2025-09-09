import type { SearchPlayerFilterEntity } from '../../repository/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../repository/entity/playerEntity';
import type { CommonParameter } from '../../utility/commonParameter';

export interface IPlayerService {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
