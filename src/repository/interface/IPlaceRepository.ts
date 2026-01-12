import type { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import type { OldSearchPlaceFilterEntity } from '../entity/filter/oldSearchPlaceFilterEntity';
import type { OldPlaceEntity } from '../entity/placeEntity';

export interface IPlaceRepository {
    fetchPlaceEntityList: (
        searchPlaceFilter: OldSearchPlaceFilterEntity,
    ) => Promise<OldPlaceEntity[]>;

    upsertPlaceEntityList: (
        entityList: OldPlaceEntity[],
    ) => Promise<UpsertResult>;
}
