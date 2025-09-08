import type { CommonParameter } from '../../utility/commonParameter';
import type { RaceEntity } from '../entity/raceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';

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
