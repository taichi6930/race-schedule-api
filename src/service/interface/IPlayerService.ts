import type { SearchPlayerFilterEntity } from '../../repository/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../repository/entity/playerEntity';

/**
 * プレイヤー情報を管理するサービスのインターフェース
 *
 * プレイヤー情報の取得・更新などのビジネスロジックを提供します
 */
export interface IPlayerService {
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
