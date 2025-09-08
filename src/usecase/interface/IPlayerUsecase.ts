import type { PlayerEntity } from '../../repository/entity/playerEntity';
import type { CommonParameter } from '../../utility/commonParameter';

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
