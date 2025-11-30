import type { UpsertResult } from '../../utility/upsertResult';
import type { SearchPlaceFilterEntity } from '../entity/filter/searchPlaceFilterEntity';
import type { PlaceEntity } from '../entity/placeEntity';

/**
 * 開催場所情報のデータアクセスを抽象化するリポジトリインターフェース
 *
 * データソースに依存しない開催場所情報の取得・更新機能を定義します
 */
export interface IPlaceRepository {
    /**
     * 検索条件に一致する開催場所エンティティの配列を取得する
     *
     * @param searchPlaceFilter - 開催場所検索フィルター
     * @returns 開催場所エンティティの配列
     */
    fetchPlaceEntityList: (
        searchPlaceFilter: SearchPlaceFilterEntity,
    ) => Promise<PlaceEntity[]>;

    /**
     * 開催場所エンティティの配列を更新または挿入する
     *
     * @param entityList - 更新または挿入する開催場所エンティティの配列
     * @returns 更新結果
     */
    upsertPlaceEntityList: (entityList: PlaceEntity[]) => Promise<UpsertResult>;
}
