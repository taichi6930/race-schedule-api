import type { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { DataLocationType } from '../../utility/dataType';
import type { UpsertResult } from '../../utility/upsertResult';

export interface IPlaceService {
    /**
     * 開催場のEntity配列を取得する
     * @param searchPlaceFilter - 場所フィルター情報
     * @param dataLocation - データ取得場所
     */
    fetchPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
        dataLocation: DataLocationType,
    ) => Promise<PlaceEntity[]>;

    /**
     * 開催場のEntity配列の更新を行う
     * @param entityList - 場所エンティティ配列
     */
    upsertPlaceEntityList: (entityList: PlaceEntity[]) => Promise<UpsertResult>;
}
