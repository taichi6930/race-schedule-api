import type { PlaceEntityForAWS } from '../../repository/entity/placeEntity';
import type { RaceType } from '../../utility/raceType';

/**
 * 開催場データUseCase Interface
 */
export interface IPlaceUseCase {
    /**
     * 開催場データを取得する
     * @param startDate - 開始日
     * @param finishDate - 終了日
     * @param raceTypeList - レース種別のリスト
     */
    fetchPlaceEntityList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<PlaceEntityForAWS[]>;

    /**
     * 開催場データを更新する
     * @param startDate - 開始日
     * @param finishDate - 終了日
     * @param raceTypeList - レース種別のリスト
     */
    updatePlaceEntityList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }>;
}
