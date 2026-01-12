import type { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import type { OldSearchPlaceFilterEntity } from '../../repository/entity/filter/oldSearchPlaceFilterEntity';
import type { OldPlaceEntity } from '../../repository/entity/placeEntity';
/**
 * レース開催場所ユースケースのインターフェース
 */
export interface IOldPlaceUseCase {
    /**
     * レース開催場所のEntity配列を取得する
     * @param searchPlaceFilter - 場所フィルター情報
     */
    fetchPlaceEntityList: (
        searchPlaceFilter: OldSearchPlaceFilterEntity,
    ) => Promise<OldPlaceEntity[]>;

    /**
     * レース開催場所のEntity配列の更新を行う
     * @param searchPlaceFilter - 場所フィルター情報
     */
    upsertPlaceEntityList: (
        searchPlaceFilter: OldSearchPlaceFilterEntity,
    ) => Promise<UpsertResult>;
}
