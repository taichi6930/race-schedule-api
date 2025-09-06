import type { PlaceEntity } from '../../../lib/src/repository/entity/placeEntity';
import type { CommonParameter } from '../../commonParameter';
export interface IPlaceUseCase {
    fetchPlaceEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (commonParameter: CommonParameter) => Promise<void>;
}
