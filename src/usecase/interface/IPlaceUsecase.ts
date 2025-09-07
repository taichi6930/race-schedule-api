import type { CommonParameter } from '../../commonParameter';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';

// UseCase層
export interface IPlaceUseCase {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilterEntity: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilterEntity: SearchPlaceFilterEntity,
    ) => Promise<void>;
}
