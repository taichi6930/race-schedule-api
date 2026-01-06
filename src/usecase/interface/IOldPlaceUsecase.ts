import type { OldSearchPlaceFilterEntity } from '../../repository/entity/filter/oldSearchPlaceFilterEntity';
import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { UpsertResult } from '../../utility/upsertResult';
/**
 * レース開催場所ユースケースのインターフェース
 */
export interface IOldPlaceUseCase {
    /**
     * レース開催場所のEntity配列を取得する
     * @param searchPlaceFilter - 場所フィルター情報
     */
    fetchPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    /**
     * レース開催場所のEntity配列の更新を行う
     * @param searchPlaceFilter - 場所フィルター情報
     */
    upsertPlaceEntityList: (
        searchPlaceFilter: OldSearchPlaceFilterEntity,
    ) => Promise<UpsertResult>;
}
