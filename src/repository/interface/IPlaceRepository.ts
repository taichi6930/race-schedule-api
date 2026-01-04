import type { UpsertResult } from '../../utility/upsertResult';
import type { OldSearchPlaceFilterEntity } from '../entity/filter/oldSearchPlaceFilterEntity';
import type { PlaceEntity } from '../entity/placeEntity';

export interface IPlaceRepository {
    fetchPlaceEntityList: (
        searchPlaceFilter: OldSearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    upsertPlaceEntityList: (entityList: PlaceEntity[]) => Promise<UpsertResult>;
}
