import type { GradeType } from '../../utility/data/common/gradeType';
import { validateGradeType } from '../../utility/data/common/gradeType';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';


export class PlaceGradeRecord implements IRecord<PlaceGradeRecord> {
    
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly grade: GradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    
    public static create(
        id: PlaceId,
        raceType: RaceType,
        grade: string,
        updateDate: Date,
    ): PlaceGradeRecord {
        try {
            return new PlaceGradeRecord(
                validatePlaceId(raceType, id),
                raceType,
                validateGradeType(raceType, grade),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create PlaceRecord', error),
            );
        }
    }

    
    public copy(partial: Partial<PlaceGradeRecord> = {}): PlaceGradeRecord {
        return PlaceGradeRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }
}
