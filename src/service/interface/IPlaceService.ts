import type { CommonParameter } from '../../commonParameter';
import type { PlaceEntity } from '../../repository/entity/placeEntity';

export interface IPlaceService {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlaceEntity[]>;
}
