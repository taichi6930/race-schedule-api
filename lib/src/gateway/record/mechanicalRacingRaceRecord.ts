import '../../utility/format';

import {
    type GradeType,
    validateGradeType,
} from '../../utility/data/common/gradeType';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/data/common/raceDateTime';
import type { RaceId } from '../../utility/data/common/raceId';
import { validateRaceId } from '../../utility/data/common/raceId';
import type { RaceName } from '../../utility/data/common/raceName';
import { validateRaceName } from '../../utility/data/common/raceName';
import {
    type RaceNumber,
    validateRaceNumber,
} from '../../utility/data/common/raceNumber';
import {
    type RaceStage,
    validateRaceStage,
} from '../../utility/data/common/raceStage';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';


export class MechanicalRacingRaceRecord
    implements IRecord<MechanicalRacingRaceRecord>
{
    
    private constructor(
        public readonly id: RaceId,
        public readonly raceType: RaceType,
        public readonly name: RaceName,
        public readonly stage: RaceStage,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly grade: GradeType,
        public readonly number: RaceNumber,
        public readonly updateDate: UpdateDate,
    ) {}

    
    public static create(
        id: string,
        raceType: RaceType,
        name: string,
        stage: string,
        dateTime: Date,
        location: string,
        grade: string,
        number: number,
        updateDate: Date,
    ): MechanicalRacingRaceRecord {
        try {
            return new MechanicalRacingRaceRecord(
                validateRaceId(raceType, id),
                raceType,
                validateRaceName(name),
                validateRaceStage(raceType, stage),
                validateRaceDateTime(dateTime),
                validateRaceCourse(raceType, location),
                validateGradeType(raceType, grade),
                validateRaceNumber(number),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(createErrorMessage('RaceRecord', error));
        }
    }

    
    public copy(
        partial: Partial<MechanicalRacingRaceRecord> = {},
    ): MechanicalRacingRaceRecord {
        return MechanicalRacingRaceRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.updateDate ?? this.updateDate,
        );
    }
}
