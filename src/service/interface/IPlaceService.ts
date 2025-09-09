import type { DataLocationType } from '../../../lib/src/utility/dataType';
import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { CommonParameter } from '../../utility/commonParameter';

export interface IPlaceService {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
        dataLocation: DataLocationType,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ) => Promise<void>;
}
