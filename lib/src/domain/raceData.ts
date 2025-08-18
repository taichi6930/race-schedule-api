import type { GradeType } from '../utility/data/common/gradeType';
import { validateGradeType } from '../utility/data/common/gradeType';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import {
    type RaceName,
    validateRaceName,
} from '../utility/data/common/raceName';
import type { RaceNumber } from '../utility/data/common/raceNumber';
import { validateRaceNumber } from '../utility/data/common/raceNumber';
import type { RaceType } from '../utility/raceType';


export class RaceData {
    
    public readonly raceType: RaceType;
    
    public readonly name: RaceName;
    
    public readonly dateTime: RaceDateTime;
    
    public readonly location: RaceCourse;
    
    public readonly grade: GradeType;
    
    public readonly number: RaceNumber;

    
    private constructor(
        raceType: RaceType,
        name: RaceName,
        dateTime: RaceDateTime,
        location: RaceCourse,
        grade: GradeType,
        number: RaceNumber,
    ) {
        this.raceType = raceType;
        this.name = name;
        this.dateTime = dateTime;
        this.location = location;
        this.grade = grade;
        this.number = number;
    }

    
    public static create(
        raceType: RaceType,
        name: string,
        dateTime: Date,
        location: string,
        grade: string,
        number: number,
    ): RaceData {
        return new RaceData(
            raceType,
            validateRaceName(name),
            validateRaceDateTime(dateTime),
            validateRaceCourse(raceType, location),
            validateGradeType(raceType, grade),
            validateRaceNumber(number),
        );
    }

    
    public copy(partial: Partial<RaceData> = {}): RaceData {
        return RaceData.create(
            partial.raceType ?? this.raceType,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
