import type { DataLocationType } from '../../../lib/src/utility/dataType';
import type { RaceEntity } from '../../repository/entity/raceEntity';
import type { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import type { CommonParameter } from '../../utility/commonParameter';

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
