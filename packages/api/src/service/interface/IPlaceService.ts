import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import type { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';

import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';

export interface IPlaceService {
    /**
     * 開催場のEntity配列を取得する
     * @param searchPlaceFilterParams - 場所フィルター情報
     */
    fetch: (
        searchPlaceFilterParams: SearchPlaceFilterParams,
    ) => Promise<PlaceEntity[]>;

    /**
     * 開催場のEntity配列をupsertする
     * @param entityList - upsert対象のEntity配列
     */
    upsert: (entityList: PlaceEntity[]) => Promise<UpsertResult>;
}
