import type { CommonParameter } from '../../commonParameter';
import type { RaceEntity } from '../../repository/entity/raceEntity';
import type { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';

export interface IRaceService {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<RaceEntity[]>;
}
