import type { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import type { DataLocationType } from '../../utility/dataType';

/**
 * 開催場所データを管理するサービスのインターフェース
 *
 * このインターフェースは、開催場所に関する以下の操作を定義します：
 * - 指定期間の開催場所データの取得（StorageまたはWebから）
 * - 開催場所データの更新（Storageに保存）
 * @typeParam P - 開催場所エンティティの型。IPlaceEntityを実装している必要があります。
 *               例：JraPlaceEntity, NarPlaceEntity など
 */
export interface IPlaceDataService<P extends IPlaceEntity<P>> {
    /**
     * 指定された期間の開催場所データを取得します
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param type - データの取得元を指定
     *              - Storage: 保存済みのデータから取得（高速）
     *              - Web: 外部Webサイトから直接取得（最新）
     * @returns 開催場所エンティティの配列。該当データがない場合は空配列
     * @throws Error データの取得に失敗した場合
     */
    fetchPlaceEntityList: (
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
    ) => Promise<P[]>;

    /**
     * 開催場所データをStorageに保存/更新します
     *
     * 既存のデータが存在する場合は上書き、存在しない場合は新規作成します。
     * このメソッドは一般的にWebから取得した最新データを保存する際に使用されます。
     * @param placeEntityList - 保存/更新する開催場所エンティティの配列
     * @throws Error データの保存/更新に失敗した場合
     */
    updatePlaceEntityList: (placeEntityList: P[]) => Promise<void>;
}
