import type { RaceCourse } from '../utility/data/common/raceCourse';
import { validateRaceCourse } from '../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import type { RaceType } from '../utility/raceType';


export class PlaceData {
    
    public readonly raceType: RaceType;
    
    public readonly dateTime: RaceDateTime;
    
    public readonly location: RaceCourse;

    
    private constructor(
        raceType: RaceType,
        dateTime: RaceDateTime,
        location: RaceCourse,
    ) {
        this.raceType = raceType;
        this.dateTime = dateTime;
        this.location = location;
    }

    
    public static create(
        raceType: RaceType,
        dateTime: Date,
        location: string,
    ): PlaceData {
        return new PlaceData(
            raceType,
            validateRaceDateTime(dateTime),
            validateRaceCourse(raceType, location),
        );
    }

    
    public copy(partial: Partial<PlaceData> = {}): PlaceData {
        return PlaceData.create(
            partial.raceType ?? this.raceType,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
