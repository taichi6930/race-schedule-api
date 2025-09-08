import type { CommonParameter } from '../../utility/commonParameter';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface IRaceRepository {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (
        commonParameter: CommonParameter,
        entityList: RaceEntity[],
    ) => Promise<void>;
}
