import type { HorseRacingPlaceEntity } from '../../repository/entity/horseRacingPlaceEntity';
import type { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../repository/entity/mechanicalRacingPlaceEntity';
import type { DataLocationType } from '../../utility/dataType';
import type { RaceType } from '../../utility/raceType';


export interface IPlaceDataService {
    
    fetchPlaceEntityList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        type: DataLocationType,
    ) => Promise<{
        [RaceType.JRA]: JraPlaceEntity[];
        [RaceType.NAR]: HorseRacingPlaceEntity[];
        [RaceType.OVERSEAS]: HorseRacingPlaceEntity[];
        [RaceType.KEIRIN]: MechanicalRacingPlaceEntity[];
        [RaceType.AUTORACE]: MechanicalRacingPlaceEntity[];
        [RaceType.BOATRACE]: MechanicalRacingPlaceEntity[];
    }>;

    
    updatePlaceEntityList: (placeEntityList: {
        [RaceType.JRA]: JraPlaceEntity[];
        [RaceType.NAR]: HorseRacingPlaceEntity[];
        [RaceType.OVERSEAS]: HorseRacingPlaceEntity[];
        [RaceType.KEIRIN]: MechanicalRacingPlaceEntity[];
        [RaceType.AUTORACE]: MechanicalRacingPlaceEntity[];
        [RaceType.BOATRACE]: MechanicalRacingPlaceEntity[];
    }) => Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }>;
}
