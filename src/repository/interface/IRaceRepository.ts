import type { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import type { OldPlaceEntity } from '../entity/placeEntity';
import type { RaceEntity } from '../entity/raceEntity';

export interface IRaceRepository {
    fetchRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: OldPlaceEntity[],
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (entityList: RaceEntity[]) => Promise<UpsertResult>;
}
