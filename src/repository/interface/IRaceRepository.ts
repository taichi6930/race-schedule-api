import type { CommonParameter } from '../../utility/commonParameter';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import type { PlaceEntity } from '../entity/placeEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface IRaceRepository {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: PlaceEntity[],
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (
        commonParameter: CommonParameter,
        entityList: RaceEntity[],
    ) => Promise<void>;
}
