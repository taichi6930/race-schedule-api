import type { CommonParameter } from '../../utility/commonParameter';
import type { SearchPlaceFilterEntity } from '../entity/filter/searchPlaceFilterEntity';
import type { PlaceEntity } from '../entity/placeEntity';

export interface IPlaceRepository {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ) => Promise<void>;
}
