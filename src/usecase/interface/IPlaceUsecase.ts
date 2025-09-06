import type { CommonParameter } from '../../commonParameter';
import type { PlaceEntity } from '../../repository/entity/placeEntity';

// UseCase層
export interface IPlaceUseCase {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlaceEntity[]>;
}
