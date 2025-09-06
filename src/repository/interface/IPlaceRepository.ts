import type { CommonParameter } from '../../commonParameter';
import type { PlaceEntity } from '../entity/placeEntity';

export interface IPlaceRepository {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlaceEntity[]>;
}
