import type { CommonParameter } from '../../utility/commonParameter';
import type { UpsertResult } from '../../utility/upsertResult';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import type { OldPlaceEntity } from '../entity/placeEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface IRaceRepository {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: OldPlaceEntity[],
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (
        commonParameter: CommonParameter,
        entityList: RaceEntity[],
    ) => Promise<UpsertResult>;
}
