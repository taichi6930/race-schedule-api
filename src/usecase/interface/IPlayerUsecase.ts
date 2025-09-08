import type { PlayerEntity } from '../../repository/entity/playerEntity';
import type { CommonParameter } from '../../utility/commonParameter';
import type { RaceType } from '../../utility/raceType';

// UseCase層
export interface IPlayerUseCase {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
        raceType: RaceType,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
