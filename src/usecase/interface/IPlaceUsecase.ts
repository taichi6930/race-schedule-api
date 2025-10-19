import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { UpsertResult } from '../../utility/upsertResult';

/**
 * 開催場ユースケースのインターフェース
 */
export interface IPlaceUseCase {
    /**
     * 開催場のEntity配列を取得する
     * @param searchPlaceFilter - 場所フィルター情報
     */
    fetchPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    /**
     * 開催場のEntity配列の更新を行う
     * @param searchPlaceFilter - 場所フィルター情報
     */
    upsertPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<UpsertResult>;
}
