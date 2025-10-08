import type { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import type { RaceEntity } from '../../repository/entity/raceEntity';
import type { UpsertResult } from '../../utility/upsertResult';

export interface IRaceUseCase {
    fetchRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<UpsertResult>;
}
