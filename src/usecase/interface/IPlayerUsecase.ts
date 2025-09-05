import type { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import type { CommonParameter } from '../../commonParameter';

// UseCase層
export interface IPlayerUseCase {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
