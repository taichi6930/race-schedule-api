import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { PlaceEntityTagged } from '../../repository/entity/placeEntities';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { CommonParameter } from '../../utility/commonParameter';

export interface IPlaceUseCase {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    fetchPlaceEntityListV2: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntityTagged[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<void>;
}
