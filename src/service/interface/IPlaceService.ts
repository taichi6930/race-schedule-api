import type { CommonParameter } from '../../commonParameter';
import type { PlaceEntity } from '../../repository/entity/placeEntity';

// Service層
export interface IPlaceService {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (commonParameter: CommonParameter) => Promise<void>;
}
