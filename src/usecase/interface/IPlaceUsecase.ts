import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { UpsertResult } from '../../utility/upsertResult';

export interface IPlaceUseCase {
    fetchPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<UpsertResult>;

    upsertPlaceEntityListV2: (
        entityList: PlaceEntity[],
    ) => Promise<UpsertResult>;
}
