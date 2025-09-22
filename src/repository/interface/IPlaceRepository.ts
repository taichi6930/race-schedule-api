import type { CommonParameter } from '../../utility/commonParameter';
import type { SearchPlaceFilterEntity } from '../entity/filter/searchPlaceFilterEntity';
import type { PlaceEntityTagged } from '../entity/placeEntities';
import type { PlaceEntity } from '../entity/placeEntity';

export interface IPlaceRepository {
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
        entityList: PlaceEntity[],
    ) => Promise<void>;
}
