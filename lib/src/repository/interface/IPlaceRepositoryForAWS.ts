import type { PlaceEntity } from '../../../../src/repository/entity/placeEntity';
import type { RaceType } from '../../../../src/utility/raceType';
import type { SearchPlaceFilterEntityForAWS } from '../entity/searchPlaceFilterEntity';

/**
 * 開催場所データの永続化を担当するリポジトリインターフェース
 *
 * このインターフェースは、開催場所データの永続化層とドメイン層を
 * 橋渡しする役割を果たします。主な責務：
 * - 開催場所データの検索・取得
 * - 開催場所データの保存・更新
 *
 * リポジトリパターンに基づき、以下の特徴を持ちます：
 * - データストアの詳細を隠蔽
 * - トランザクション管理
 * - エンティティの集約管理
 *
 * 実装クラスは以下のようなデータストアに対応できます：
 * - ストレージ（S3, ローカルファイルなど）
 * - データベース（SQLite, RDBMSなど）
 * - 外部API（HTMLスクレイピングなど）
 */
export interface IPlaceRepositoryForAWS {
    /**
     * 指定された検索条件に基づいて開催場所データを取得します
     *
     * このメソッドは以下の処理を行います：
     * 1. 検索フィルターに基づいてクエリを構築
     * 2. データストアに対してクエリを実行
     * 3. 取得したデータをエンティティに変換
     * @param searchFilter - 検索条件を指定するフィルターエンティティ
     * - 開始日・終了日による期間指定
     * - 場所IDによる絞り込み
     * - その他の検索条件
     * @returns 開催場所エンティティの配列。該当データがない場合は空配列
     * @throws Error データの取得に失敗した場合
     */
    fetchPlaceEntityList: (
        searchFilter: SearchPlaceFilterEntityForAWS,
    ) => Promise<PlaceEntity[]>;

    /**
     * 開催場所データを一括で登録/更新します
     *
     * このメソッドは以下の処理を行います：
     * 1. 既存データの有無を確認
     * 2. データの整合性をチェック
     * 3. 一括でデータを保存/更新
     * @param placeEntityList - 登録/更新する開催場所エンティティの配列
     * @throws Error 以下の場合にエラーが発生：
     *               - データの整合性チェックに失敗
     *               - データストアへの書き込みに失敗
     *               - 一意制約違反が発生
     */
    upsertPlaceEntityList: (
        raceType: RaceType,
        placeEntityList: PlaceEntity[],
    ) => Promise<{
        code: number;
        message: string;
        successData: PlaceEntity[];
        failureData: PlaceEntity[];
    }>;
}
