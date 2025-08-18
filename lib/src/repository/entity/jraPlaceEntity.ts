import type { HeldDayData } from '../../domain/heldDayData';
import type { PlaceData } from '../../domain/placeData';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import type { PlaceId } from '../../utility/data/common/placeId';
import {
    generatePlaceId,
    validatePlaceId,
} from '../../utility/data/common/placeId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';


export class JraPlaceEntity implements IPlaceEntity<JraPlaceEntity> {
    
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: PlaceData,
        public readonly heldDayData: HeldDayData,
        public readonly updateDate: UpdateDate,
    ) {}

    
    public static create(
        id: string,
        placeData: PlaceData,
        heldDayData: HeldDayData,
        updateDate: Date,
    ): JraPlaceEntity {
        return new JraPlaceEntity(
            validatePlaceId(placeData.raceType, id),
            placeData,
            heldDayData,
            validateUpdateDate(updateDate),
        );
    }

    
    public static createWithoutId(
        placeData: PlaceData,
        heldDayData: HeldDayData,
        updateDate: Date,
    ): JraPlaceEntity {
        return JraPlaceEntity.create(
            generatePlaceId(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
            ),
            placeData,
            heldDayData,
            updateDate,
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

    
    public copy(partial: Partial<JraPlaceEntity> = {}): JraPlaceEntity {
        return JraPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.heldDayData ?? this.heldDayData,
            partial.updateDate ?? this.updateDate,
        );
    }
}
