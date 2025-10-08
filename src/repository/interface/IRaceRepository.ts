import type { UpsertResult } from '../../utility/upsertResult';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import type { PlaceEntity } from '../entity/placeEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface IRaceRepository {
    fetchRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: PlaceEntity[],
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (entityList: RaceEntity[]) => Promise<UpsertResult>;
}
