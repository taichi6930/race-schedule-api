import type { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import type { CommonParameter } from '../../commonParameter';
import type { PlayerRecord } from '../implement/playerRepository';

export interface IPlayerRepository {
    fetchPlayerDataList: (
        commonParameter: CommonParameter,
    ) => Promise<PlayerRecord[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
