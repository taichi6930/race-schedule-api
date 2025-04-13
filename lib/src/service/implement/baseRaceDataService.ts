import { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { DataLocation, type DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import type { IRaceDataService } from '../interface/IRaceDataService';

/**
 * レース開催情報の取得と更新を担当する基底サービスクラス
 *
 * このクラスは、各種競技のレースデータサービスの共通機能を提供する
 * 抽象基底クラスです。主な責務：
 * - レース開催データの取得（Storage/Web）
 * - データの永続化
 * - エラーハンドリング
 * - データソースの適切な切り替え
 *
 * 特徴：
 * - Template Methodパターンの実装
 * - 柔軟なデータソース切り替え
 * - 統一的なエラー処理
 * - ロギング機能の統合
 *
 * @typeParam R - レースエンティティの型。IRaceEntityを実装している必要があります。
 * @typeParam P - 開催場所エンティティの型。IPlaceEntityを実装している必要があります。
 *
 * @example
 * ```typescript
 * class MyRaceDataService extends BaseRaceDataService<MyRaceEntity, MyPlaceEntity> {
 *   protected raceRepositoryFromStorage = new MyRaceRepositoryFromStorage();
 *   protected raceRepositoryFromHtml = new MyRaceRepositoryFromHtml();
 * }
 * ```
 */
export abstract class BaseRaceDataService<
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
> implements IRaceDataService<R, P>
{
    protected abstract raceRepositoryFromStorage: IRaceRepository<R, P>;
    protected abstract raceRepositoryFromHtml: IRaceRepository<R, P>;

    /**
     * 指定された期間のレース開催データを取得します
     *
     * このメソッドは、指定されたデータソース（StorageまたはWeb）から
     * レース開催情報を取得します。エラーが発生した場合は空配列を返し、
     * アプリケーションの継続性を保証します。
     *
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param type - データ取得元の指定（storage/web）
     * @param placeEntityList - 関連する開催場所エンティティのリスト。
     *                        主にWeb取得時に使用され、場所情報の補完に利用。
     * @returns レース開催エンティティの配列。エラー時は空配列
     *
     * @throws エラーはキャッチされログ出力されます
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
        placeEntityList?: P[],
    ): Promise<R[]> {
        try {
            const fetchRaceListRequest = new SearchRaceFilterEntity<P>(
                startDate,
                finishDate,
                placeEntityList,
            );
            const repository = this.getRaceRepository(type);

            const raceEntityList: R[] =
                await repository.fetchRaceEntityList(fetchRaceListRequest);

            return raceEntityList;
        } catch (error) {
            console.error('レース開催データの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * レース開催データをストレージに保存/更新します
     *
     * このメソッドは、取得したレース開催データを永続化します。
     * 空の配列が渡された場合は何も実行せず、エラーが発生した場合は
     * ログ出力のみを行い、アプリケーションの実行を継続します。
     *
     * @param raceEntityList - 保存/更新するレース開催エンティティの配列
     * @throws エラーはキャッチされログ出力されます
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async updateRaceEntityList(raceEntityList: R[]): Promise<void> {
        try {
            if (raceEntityList.length === 0) return;
            await this.raceRepositoryFromStorage.registerRaceEntityList(
                raceEntityList,
            );
        } catch (error) {
            console.error('レース開催データの更新に失敗しました', error);
        }
    }

    /**
     * データソースに応じた適切なリポジトリインスタンスを取得します
     *
     * このメソッドは、指定されたデータソースタイプに基づいて、
     * 適切なリポジトリ実装を返します。Strategy パターンの実装として
     * 機能します。
     *
     * @param type - データソースの種類（storage/web）
     * @returns 指定されたデータソースに対応するリポジトリインスタンス
     * @internal このメソッドはクラス内部でのみ使用されます
     */
    private getRaceRepository(type: DataLocationType): IRaceRepository<R, P> {
        switch (type) {
            case DataLocation.Storage: {
                return this.raceRepositoryFromStorage;
            }
            case DataLocation.Web: {
                return this.raceRepositoryFromHtml;
            }
        }
    }
}
