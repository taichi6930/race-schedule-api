import type { SearchPlayerFilterEntity } from '../entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../entity/playerEntity';

/**
 * プレイヤー情報のデータアクセスを抽象化するリポジトリインターフェース
 *
 * データソースに依存しないプレイヤー情報の取得・更新機能を定義します
 */
export interface IPlayerRepository {
    /**
     * 検索条件に一致するプレイヤーエンティティの配列を取得する
     *
     * @param searchPlayerFilter - プレイヤー検索フィルター
     * @returns プレイヤーエンティティの配列
     */
    fetchPlayerEntityList: (
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    /**
     * プレイヤーエンティティの配列を更新または挿入する
     *
     * @param entityList - 更新または挿入するプレイヤーエンティティの配列
     */
    upsertPlayerEntityList: (entityList: PlayerEntity[]) => Promise<void>;
}
