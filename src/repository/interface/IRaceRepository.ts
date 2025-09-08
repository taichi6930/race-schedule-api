import type { CommonParameter } from '../../commonParameter';
import type { RaceEntity } from '../entity/raceEntity';

export interface IRaceRepository {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<RaceEntity[]>;
}
