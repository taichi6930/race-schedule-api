import type { CommonParameter } from '../../commonParameter';
import type { PlayerEntity } from '../../repository/entity/playerEntity';

export interface IPlayerService {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
