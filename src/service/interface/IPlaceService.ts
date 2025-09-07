import type { DataLocationType } from '../../../lib/src/utility/dataType';
import type { RaceType } from '../../../lib/src/utility/raceType';
import type { CommonParameter } from '../../commonParameter';
import type { PlaceEntity } from '../../repository/entity/placeEntity';

export interface IPlaceService {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        raceType: RaceType,
        startDate: Date,
        endDate: Date,
        dataLocationType: DataLocationType,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ) => Promise<void>;
}
