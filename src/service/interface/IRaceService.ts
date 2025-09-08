import type { DataLocationType } from '../../../lib/src/utility/dataType';
import type { CommonParameter } from '../../commonParameter';
import type { RaceEntity } from '../../repository/entity/raceEntity';
import type { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';

export interface IRaceService {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (
        commonParameter: CommonParameter,
        entityList: RaceEntity[],
    ) => Promise<void>;
}
