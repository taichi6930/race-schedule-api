import type { CommonParameter } from '../../commonParameter';
import type { PlayerEntity } from '../../repository/entity/playerEntity';

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
