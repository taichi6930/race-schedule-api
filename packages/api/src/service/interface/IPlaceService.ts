import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';

import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';

export interface IPlaceService {
    /**
     * 開催場のEntity配列を取得する
     * @param searchPlaceFilterParams - 場所フィルター情報
     */
    fetchPlaceEntityList: (
        searchPlaceFilterParams: SearchPlaceFilterParams,
    ) => Promise<PlaceEntity[]>;
}
