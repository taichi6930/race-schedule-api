import type { PlaceData } from '../../domain/placeData';
import type { RaceType } from '../../utility/raceType';


export interface IPlaceDataUseCase {
    
    fetchPlaceDataList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<PlaceData[]>;
    
    updatePlaceDataList: (
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
