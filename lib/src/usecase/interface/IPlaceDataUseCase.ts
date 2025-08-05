import type { JraPlaceData } from '../../domain/jraPlaceData';
import type { MechanicalRacingPlaceData } from '../../domain/mechanicalRacingPlaceData';
import type { NarPlaceData } from '../../domain/narPlaceData';

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
    ) => Promise<JraPlaceData[] | MechanicalRacingPlaceData[] | NarPlaceData[]>;
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
