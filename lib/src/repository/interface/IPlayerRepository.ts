import type { PlayerEntityForAWS } from '../entity/playerEntity';
import type { SearchPlayerFilterEntityForAWS } from '../entity/searchPlayerFilterEntity';

// Playerエンティティ型定義
export interface IPlayerRepositoryForAWS {
    /**
     * 全てのプレイヤー情報を取得します。
     * @returns プレイヤー情報のリスト
     */
    findAll: (
        searchFilter: SearchPlayerFilterEntityForAWS,
    ) => Promise<PlayerEntityForAWS[]>;
}
