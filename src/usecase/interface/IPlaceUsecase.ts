import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { OldPlaceEntity } from '../../repository/entity/placeEntity';
import type { CommonParameter } from '../../utility/commonParameter';

export interface IPlaceUseCase {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<OldPlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<void>;
}
