import type { UpsertResult } from '../../utility/upsertResult';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import type { PlaceEntity } from '../entity/placeEntity';
import type { RaceEntity } from '../entity/raceEntity';

/**
 * レース情報のデータアクセスを抽象化するリポジトリインターフェース
 *
 * データソースに依存しないレース情報の取得・更新機能を定義します
 */
export interface IRaceRepository {
    /**
     * 検索条件に一致するレースエンティティの配列を取得する
     *
     * @param searchRaceFilter - レース検索フィルター
     * @param placeEntityList - 開催場所エンティティの配列（オプション）
     * @returns レースエンティティの配列
     */
    fetchRaceEntityList: (
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: PlaceEntity[],
    ) => Promise<RaceEntity[]>;

    /**
     * レースエンティティの配列を更新または挿入する
     *
     * @param entityList - 更新または挿入するレースエンティティの配列
     * @returns 更新結果
     */
    upsertRaceEntityList: (entityList: RaceEntity[]) => Promise<UpsertResult>;
}
