import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';

import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';

/**
 * 開催場情報取得リポジトリのインターフェース
 */
export interface IPlaceRepository {
    /**
     * 開催場Entity配列を取得する
     * @param searchPlaceFilterParams - 場所フィルター情報
     */
    fetch: (
        searchPlaceFilterParams: SearchPlaceFilterParams,
    ) => Promise<PlaceEntity[]>;
}
