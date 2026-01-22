import type { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../domain/entity/playerEntity';

/**
 * Player に関する業務ロジック（Usecase）のインターフェース定義
 */
export interface IPlayerUsecase {
    /**
     * 選手データを取得する
     * @param searchPlayerFilter - 選手検索フィルター
     * @return 選手エンティティリスト
     */
    fetchPlayerEntityList: (
        searchPlayerFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;

    /**
     * 選手データを登録/更新する
     * @param entityList - 選手エンティティリスト
     */
    upsertPlayerEntityList: (entityList: PlayerEntity[]) => Promise<void>;
}
