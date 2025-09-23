import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { OldPlaceEntity } from '../../repository/entity/placeEntity';
import type { CommonParameter } from '../../utility/commonParameter';
import type { DataLocationType } from '../../utility/dataType';

export interface IPlaceService {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
        dataLocation: DataLocationType,
    ) => Promise<OldPlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        entityList: OldPlaceEntity[],
    ) => Promise<void>;
}
