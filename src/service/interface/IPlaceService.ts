import type { DataLocationType } from '../../../lib/src/utility/dataType';
import type { CommonParameter } from '../../commonParameter';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';

export interface IPlaceService {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilterEntity: SearchPlaceFilterEntity,
        dataLocationType: DataLocationType,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ) => Promise<void>;
}
