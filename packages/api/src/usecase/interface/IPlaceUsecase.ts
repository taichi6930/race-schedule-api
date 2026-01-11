import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';

import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';

/**
 * レース開催場所ユースケースのインターフェース
 */
export interface IPlaceUsecase {
    /**
     * レース開催場所のEntity配列を取得する
     * @param searchPlaceFilterParams - 場所フィルター情報
     */
    fetch: (
        searchPlaceFilterParams: SearchPlaceFilterParams,
    ) => Promise<PlaceEntity[]>;
}
