import type { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import type { CommonParameter } from '../../commonParameter';

// Service層
export interface IPlayerService {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
