import type { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import type { RaceEntity } from '../../repository/entity/raceEntity';
import type { CommonParameter } from '../../utility/commonParameter';

export interface IRaceUseCase {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<void>;
}
