import type { CommonParameter } from '../../commonParameter';
import type { PlaceEntity } from '../entity/placeEntity';
import type { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';

export interface IPlaceRepository {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilterEntity: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ) => Promise<void>;
}
