import type { RaceType } from '../../utility/raceType';
import type { IPlaceEntity } from '../entity/iPlaceEntity';
import type { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';


export interface IPlaceRepository<P extends IPlaceEntity<P>> {
    
    fetchPlaceEntityList: (
        searchFilter: SearchPlaceFilterEntity,
    ) => Promise<P[]>;

    
    registerPlaceEntityList: (
        raceType: RaceType,
        placeEntityList: P[],
    ) => Promise<{
        code: number;
        message: string;
        successData: P[];
        failureData: P[];
    }>;
}
