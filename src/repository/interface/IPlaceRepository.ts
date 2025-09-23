import type { CommonParameter } from '../../utility/commonParameter';
import type { SearchPlaceFilterEntity } from '../entity/filter/searchPlaceFilterEntity';
import type { OldPlaceEntity } from '../entity/placeEntity';

export interface IPlaceRepository {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<OldPlaceEntity[]>;

    upsertPlaceEntityList: (
        commonParameter: CommonParameter,
        entityList: OldPlaceEntity[],
    ) => Promise<void>;
}
