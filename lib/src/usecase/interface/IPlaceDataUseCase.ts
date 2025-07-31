import type { AutoracePlaceData } from '../../domain/autoracePlaceData';
import type { BoatracePlaceData } from '../../domain/boatracePlaceData';
import type { JraPlaceData } from '../../domain/jraPlaceData';
import type { KeirinPlaceData } from '../../domain/keirinPlaceData';
import type { NarPlaceData } from '../../domain/narPlaceData';
import type { WorldPlaceData } from '../../domain/worldPlaceData';

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
    ) => Promise<
        | JraPlaceData[]
        | NarPlaceData[]
        | WorldPlaceData[]
        | KeirinPlaceData[]
        | AutoracePlaceData[]
        | BoatracePlaceData[]
    >;
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
