import type { CommonParameter } from '../../utility/commonParameter';
import type { PlayerEntity } from '../entity/playerEntity';

export interface IPlayerRepository {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
