import type { CommonParameter } from '../../utility/commonParameter';
import type { RaceType } from '../../utility/raceType';
import type { PlayerEntity } from '../entity/playerEntity';

export interface IPlayerRepository {
    fetchPlayerEntityList: (
        commonParameter: CommonParameter,
        raceType: RaceType,
    ) => Promise<PlayerEntity[]>;

    upsertPlayerEntityList: (
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ) => Promise<void>;
}
