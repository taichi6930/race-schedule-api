import type { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import type { CommonParameter } from '../../commonParameter';

export interface IPlayerRepository {
    fetchPlayerDataList: (
        commonParameter: CommonParameter,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
