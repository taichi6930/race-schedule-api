import type { PlaceEntity } from '../../repository/entity/placeEntity';
import type { RaceType } from '../../utility/raceType';

/**
 * 開催場データUseCaseインターフェース
 */
export interface IPlaceDataUseCase {
    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlaceEntityList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<PlaceEntity[]>;

    /**
     * 開催場データを更新する
     * @param startDate
     * @param finishDate
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
