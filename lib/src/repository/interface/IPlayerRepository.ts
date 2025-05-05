import type { PlayerEntity } from '../entity/playerEntity';
import type { SearchPlayerFilterEntity } from '../entity/searchPlayerFilterEntity';

/**
 * プレイヤー情報の取得を担当するリポジトリインターフェース
 *
 * このインターフェースは、レース出場選手の情報を取得する機能を提供します。
 * 主な責務：
 * - プレイヤー情報の検索と取得
 * - 検索条件に基づくフィルタリング
 * - プレイヤーデータの形式変換
 *
 * 他のリポジトリと異なる特徴：
 * - プレイヤー固有の検索条件対応
 * - 選手情報の一括取得
 * - パフォーマンスデータの集計
 */
export interface IPlayerRepository {
    /**
     * 指定された条件に基づいてプレイヤー情報を取得します
     *
     * このメソッドは以下の処理を行います：
     * 1. 検索フィルターに基づいてクエリを構築
     * 2. プレイヤー情報をデータソースから取得
     * 3. 取得したデータをPlayerEntity形式に変換
     * @param searchFilter - 検索条件を指定するフィルターエンティティ
     * - プレイヤーID
     * - レース種別
     * - その他の検索条件
     * @returns プレイヤーエンティティの配列。該当するプレイヤーが存在しない場合は空配列
     * @throws Error 以下の場合にエラーが発生：
     *               - データソースとの通信に失敗
     *               - 無効な検索条件が指定された
     *               - データの形式が不正
     */
    fetchPlayerEntityList: (
        searchFilter: SearchPlayerFilterEntity,
    ) => Promise<PlayerEntity[]>;
}
