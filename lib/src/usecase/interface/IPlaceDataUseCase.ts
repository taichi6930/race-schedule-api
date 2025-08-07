import type { PlaceData } from '../../domain/placeData';
import type { RaceType } from '../../utility/raceType';

/**
 * IPlaceDataUseCase
 */
export interface IPlaceDataUseCase {
    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlaceDataList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<PlaceData[]>;
    /**
     * 開催場データを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceDataList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<void>;
}
