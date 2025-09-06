import type { CommonParameter } from '../../commonParameter';
import type { PlayerEntity } from '../entity/playerEntity';

export interface IPlayerRepository {
    fetchPlayerDataList: (
        commonParameter: CommonParameter,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
