import { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IOldPlaceDataService } from '../interface/IOldPlaceDataService';

/**
 * 開催場所データの取得と更新を担当する基底サービスクラス
 *
 * このクラスは、各種競技の開催場所データサービスの共通機能を提供する
 * 抽象基底クラスです。BaseRaceDataServiceと対になり、主な責務：
 * - 開催場所データの取得（Storage/Web）
 * - データの永続化
 * - エラーハンドリング
 * - データソースの適切な切り替え
 *
 * 特徴：
 * - Template Methodパターンの実装
 * - 柔軟なデータソース切り替え
 * - 統一的なエラー処理
 * - ロギング機能の統合
 * @typeParam P - 開催場所エンティティの型。IPlaceEntityを実装している必要があります。
 *               例：JraPlaceEntity, NarPlaceEntity など
 * @example
 * ```typescript
 * class MyPlaceDataService extends BasePlaceDataService<MyPlaceEntity> {
 *   protected placeRepositoryFromStorage = new MyPlaceRepositoryFromStorage();
 *   protected placeRepositoryFromHtml = new MyPlaceRepositoryFromHtml();
 * }
 * ```
 */
export abstract class BasePlaceDataService<P extends IPlaceEntity<P>>
    implements IOldPlaceDataService<P>
{
    protected abstract placeRepositoryFromStorage: IPlaceRepository<P>;
    protected abstract placeRepositoryFromHtml: IPlaceRepository<P>;

    /**
     * 指定された期間の開催場所データを取得します
     *
     * このメソッドは、指定されたデータソース（StorageまたはWeb）から
     * 開催場所情報を取得します。エラーが発生した場合は空配列を返し、
     * アプリケーションの継続性を保証します。
     *
     * レースデータ取得の前提として使用され、開催場所の基本情報を
     * 提供する重要な役割を持ちます。
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param type - データ取得元の指定（storage/web）
     * @returns 開催場所エンティティの配列。エラー時は空配列
     * @throws エラーはキャッチされログ出力されます
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async fetchPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
    ): Promise<P[]> {
        try {
            const searchFilter = new SearchPlaceFilterEntity(
                startDate,
                finishDate,
            );
            const repository = this.getPlaceRepository(type);

            const placeEntityList =
                await repository.fetchPlaceEntityList(searchFilter);
            return placeEntityList;
        } catch (error) {
            console.error('開催場データの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * データソースに応じた適切なリポジトリインスタンスを取得します
     *
     * このメソッドは、指定されたデータソースタイプに基づいて、
     * 適切なリポジトリ実装を返します。Strategy パターンの実装として
     * 機能します。
     *
     * デフォルトでは以下のリポジトリを使用：
     * - Storage: S3またはローカルストレージからの取得
     * - Web: 公式サイトからのスクレイピング
     * @param type - データソースの種類（storage/web）
     * @returns 指定されたデータソースに対応するリポジトリインスタンス
     */
    private getPlaceRepository(type: DataLocationType): IPlaceRepository<P> {
        switch (type) {
            case DataLocation.Storage: {
                return this.placeRepositoryFromStorage;
            }
            case DataLocation.Web: {
                return this.placeRepositoryFromHtml;
            }
        }
    }
}
