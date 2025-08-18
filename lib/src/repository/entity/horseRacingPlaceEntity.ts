import type { PlaceData } from '../../domain/placeData';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import type { PlaceId } from '../../utility/data/common/placeId';
import {
    generatePlaceId,
    validatePlaceId,
} from '../../utility/data/common/placeId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';


export class HorseRacingPlaceEntity
    implements IPlaceEntity<HorseRacingPlaceEntity>
{
    
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: PlaceData,
        public readonly updateDate: UpdateDate,
    ) {}

    
    public static create(
        id: string,
        placeData: PlaceData,
        updateDate: Date,
    ): HorseRacingPlaceEntity {
        return new HorseRacingPlaceEntity(
            validatePlaceId(placeData.raceType, id),
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    
    public static createWithoutId(
        placeData: PlaceData,
        updateDate: Date,
    ): HorseRacingPlaceEntity {
        return HorseRacingPlaceEntity.create(
            generatePlaceId(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
            ),
            placeData,
            updateDate,
        );
    }

    
    public copy(
        partial: Partial<HorseRacingPlaceEntity> = {},
    ): HorseRacingPlaceEntity {
        return HorseRacingPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
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
