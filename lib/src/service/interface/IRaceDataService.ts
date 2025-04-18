import type { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import type { IRaceEntity } from '../../repository/entity/iRaceEntity';
import type { DataLocationType } from '../../utility/dataType';

/**
 * レース開催データを管理するサービスのインターフェース
 *
 * このインターフェースは、レース開催に関する以下の操作を定義します：
 * - 指定期間のレース開催データの取得（StorageまたはWebから）
 * - レース開催データの更新（Storageに保存）
 *
 * レースデータは開催場所データと密接に関連しており、多くの場合開催場所の
 * 情報を参照して処理を行います。
 * @typeParam R - レース開催エンティティの型。IRaceEntityを実装している必要があります。
 *               例：JraRaceEntity, NarRaceEntity など
 * @typeParam P - 開催場所エンティティの型。IPlaceEntityを実装している必要があります。
 *               例：JraPlaceEntity, NarPlaceEntity など
 */
export interface IRaceDataService<
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
> {
    /**
     * 指定された期間のレース開催データを取得します
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param type - データの取得元を指定
     *              - Storage: 保存済みのデータから取得（高速）
     *              - Web: 外部Webサイトから直接取得（最新）
     * @param placeEntityList - 関連する開催場所エンティティのリスト
     *                         主にWeb取得時に使用され、場所情報の補完に利用
     *                         省略時は場所情報なしでデータを取得
     * @returns レース開催エンティティの配列。該当データがない場合は空配列
     * @throws Error データの取得に失敗した場合
     */
    fetchRaceEntityList: (
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
        placeEntityList?: P[],
    ) => Promise<R[]>;

    /**
     * レース開催データをStorageに保存/更新します
     *
     * 既存のデータが存在する場合は上書き、存在しない場合は新規作成します。
     * このメソッドは一般的にWebから取得した最新データを保存する際に使用されます。
     * @param raceEntityList - 保存/更新するレース開催エンティティの配列
     * @throws Error データの保存/更新に失敗した場合
     */
    updateRaceEntityList: (raceEntityList: R[]) => Promise<void>;
}
