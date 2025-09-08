import type { PlayerEntity } from '../../repository/entity/playerEntity';
import type { CommonParameter } from '../../utility/commonParameter';

export interface IPlayerService {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
