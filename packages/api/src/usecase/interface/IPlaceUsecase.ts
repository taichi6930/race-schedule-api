import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import type { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';

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

    /**
     * レース開催場所のEntity配列の更新を行う
     * @param entityList - レース開催場所エンティティ配列
     */
    upsert: (entityList: PlaceEntity[]) => Promise<UpsertResult>;
}
