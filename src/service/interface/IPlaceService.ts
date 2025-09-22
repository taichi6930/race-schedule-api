import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { PlaceEntityTagged } from '../../repository/entity/placeEntities';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { CommonParameter } from '../../utility/commonParameter';
import type { DataLocationType } from '../../utility/dataType';

export interface IPlaceService {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
        dataLocation: DataLocationType,
    ) => Promise<PlaceEntity[]>;

    fetchPlaceEntityListV2: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
        dataLocation: DataLocationType,
    ) => Promise<PlaceEntityTagged[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ) => Promise<void>;
}
