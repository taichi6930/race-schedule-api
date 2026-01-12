import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import type { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';

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

    /**
     * 開催場Entity配列をupsertする
     * @param entityList - upsert対象のEntity配列
     */
    upsert: (entityList: PlaceEntity[]) => Promise<UpsertResult>;
}
