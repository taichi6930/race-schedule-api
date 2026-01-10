import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import type { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';

import type { SearchPlaceFilterEntity } from '../dto/searchPlaceFilterEntity';

export interface IPlaceService {
    /**
     * 開催場のEntity配列を取得する
     * @param searchPlaceFilter - 場所フィルター情報
     * @param dataLocation - データ取得場所
     */
    fetchPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    /**
     * 開催場のEntity配列の更新を行う
     * @param entityList - 場所エンティティ配列
     */
    upsertPlaceEntityList: (entityList: PlaceEntity[]) => Promise<UpsertResult>;
}
