import type { UpsertResult } from '../../utility/upsertResult';
import type { SearchPlaceFilterEntity } from '../entity/filter/searchPlaceFilterEntity';
import type { PlaceEntity } from '../entity/placeEntity';

export interface IPlaceRepository {
    fetchPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (entityList: PlaceEntity[]) => Promise<UpsertResult>;
}
