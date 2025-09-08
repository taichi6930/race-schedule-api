import type { CommonParameter } from '../../commonParameter';
import type { RaceEntity } from '../../repository/entity/raceEntity';

export interface IRaceService {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<RaceEntity[]>;
}
