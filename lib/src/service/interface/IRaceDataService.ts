import type { HorseRacingPlaceEntity } from '../../repository/entity/horseRacingPlaceEntity';
import type { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import type { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import type { DataLocationType } from '../../utility/dataType';
import type { RaceType } from '../../utility/raceType';


export interface IRaceDataService {
    
    fetchRaceEntityList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        type: DataLocationType,
        placeEntityList?: {
            [RaceType.JRA]?: JraPlaceEntity[];
            [RaceType.NAR]?: HorseRacingPlaceEntity[];
            [RaceType.OVERSEAS]?: HorseRacingPlaceEntity[];
            [RaceType.KEIRIN]?: MechanicalRacingPlaceEntity[];
            [RaceType.AUTORACE]?: MechanicalRacingPlaceEntity[];
            [RaceType.BOATRACE]?: MechanicalRacingPlaceEntity[];
        },
    ) => Promise<{
        [RaceType.JRA]: JraRaceEntity[];
        [RaceType.NAR]: HorseRacingRaceEntity[];
        [RaceType.OVERSEAS]: HorseRacingRaceEntity[];
        [RaceType.KEIRIN]: MechanicalRacingRaceEntity[];
        [RaceType.AUTORACE]: MechanicalRacingRaceEntity[];
        [RaceType.BOATRACE]: MechanicalRacingRaceEntity[];
    }>;

    
    updateRaceEntityList: (raceEntityList: {
        [RaceType.JRA]?: JraRaceEntity[];
        [RaceType.NAR]?: HorseRacingRaceEntity[];
        [RaceType.OVERSEAS]?: HorseRacingRaceEntity[];
        [RaceType.KEIRIN]?: MechanicalRacingRaceEntity[];
        [RaceType.AUTORACE]?: MechanicalRacingRaceEntity[];
        [RaceType.BOATRACE]?: MechanicalRacingRaceEntity[];
    }) => Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }>;
}
