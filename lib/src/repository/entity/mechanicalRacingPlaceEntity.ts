import type { PlaceData } from '../../domain/placeData';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import {
    type GradeType,
    validateGradeType,
} from '../../utility/data/common/gradeType';
import type { PlaceId } from '../../utility/data/common/placeId';
import {
    generatePlaceId,
    validatePlaceId,
} from '../../utility/data/common/placeId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';


export class MechanicalRacingPlaceEntity
    implements IPlaceEntity<MechanicalRacingPlaceEntity>
{
    
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: PlaceData,
        public readonly grade: GradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    
    public static create(
        id: string,
        placeData: PlaceData,
        grade: GradeType,
        updateDate: Date,
    ): MechanicalRacingPlaceEntity {
        return new MechanicalRacingPlaceEntity(
            validatePlaceId(placeData.raceType, id),
            placeData,
            validateGradeType(placeData.raceType, grade),
            validateUpdateDate(updateDate),
        );
    }

    
    public static createWithoutId(
        placeData: PlaceData,
        grade: GradeType,
        updateDate: Date,
    ): MechanicalRacingPlaceEntity {
        return MechanicalRacingPlaceEntity.create(
            generatePlaceId(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
            ),
            placeData,
            grade,
            updateDate,
        );
    }

    
    public copy(
        partial: Partial<MechanicalRacingPlaceEntity> = {},
    ): MechanicalRacingPlaceEntity {
        return MechanicalRacingPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    
    public toRecord(): PlaceRecord {
        return PlaceRecord.create(
            this.id,
            this.placeData.raceType,
            this.placeData.dateTime,
            this.placeData.location,
            this.updateDate,
        );
    }
}
