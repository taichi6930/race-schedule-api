import type { PlaceEntity } from '../../../../src/repository/entity/placeEntity';
import type { RaceType } from '../../../../src/utility/raceType';
import type { DataLocationType } from '../../utility/dataType';

/**
 * 開催場所データを提供するサービスインターフェース
 */
export interface IPlaceServiceForAWS {
    /**
     * 指定期間・種別の開催場所データを取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     * @param type - データ取得元（storage/web）
     * @returns 開催場所エンティティ配列（エラー時は空配列）
     */
    fetchPlaceEntityList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        type: DataLocationType,
    ) => Promise<PlaceEntity[]>;

    /**
     * 開催場所データをStorageに保存・更新
     * @param placeEntityList - 保存・更新する開催場所エンティティ配列
     * @throws Error 保存・更新に失敗した場合
     */
    updatePlaceEntityList: (placeEntityList: PlaceEntity[]) => Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }>;
}
