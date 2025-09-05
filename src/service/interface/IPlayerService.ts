import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';

// Service層
export interface IPlayerService {
    fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]>;

    upsertPlayerEntityList(
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ): Promise<void>;
}
