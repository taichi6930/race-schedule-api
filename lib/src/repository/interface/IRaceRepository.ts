import type { RaceType } from '../../utility/raceType';
import type { IPlaceEntity } from '../entity/iPlaceEntity';
import type { IRaceEntity } from '../entity/iRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';


export interface IRaceRepository<
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
> {
    
    fetchRaceEntityList: (
        searchFilter: SearchRaceFilterEntity<P>,
    ) => Promise<R[]>;
    
    registerRaceEntityList: (
        raceType: RaceType,
        raceEntityList: R[],
    ) => Promise<{
        code: number;
        message: string;
        successData: R[];
        failureData: R[];
    }>;
}
