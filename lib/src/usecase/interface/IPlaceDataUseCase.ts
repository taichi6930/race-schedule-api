import type { PlaceData } from '../../domain/placeData';

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
        raceTypeList: string[],
    ) => Promise<PlaceData[]>;
    /**
     * 開催場データを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceDataList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
    ) => Promise<void>;
}
