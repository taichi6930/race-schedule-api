import type { RaceCourseType } from '../utility/data/common/raceCourseType';
import { validateRaceCourseType } from '../utility/data/common/raceCourseType';
import type { RaceDistance } from '../utility/data/common/raceDistance';
import { validateRaceDistance } from '../utility/data/common/raceDistance';

export class HorseRaceConditionData {
    
    public readonly surfaceType: RaceCourseType;
    
    public readonly distance: RaceDistance;

    
    private constructor(surfaceType: RaceCourseType, distance: RaceDistance) {
        this.surfaceType = surfaceType;
        this.distance = distance;
    }

    
    public static create(
        surfaceType: string,
        distance: number,
    ): HorseRaceConditionData {
        return new HorseRaceConditionData(
            validateRaceCourseType(surfaceType),
            validateRaceDistance(distance),
        );
    }

    
    public copy(
        partial: Partial<HorseRaceConditionData> = {},
    ): HorseRaceConditionData {
        return HorseRaceConditionData.create(
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
        );
    }
}
