import type { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { RaceEntity } from '../../repository/entity/raceEntity';
import type { DataLocationType } from '../../utility/dataType';
import type { UpsertResult } from '../../utility/upsertResult';

export interface IRaceService {
    fetchRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
        placeEntityList?: PlaceEntity[],
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (entityList: RaceEntity[]) => Promise<UpsertResult>;
}
