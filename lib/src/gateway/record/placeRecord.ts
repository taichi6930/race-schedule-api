import { PlaceData } from '../../domain/placeData';
import { HorseRacingPlaceEntity } from '../../repository/entity/horseRacingPlaceEntity';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import type { RaceCourse } from '../../utility/data/common/raceCourse';
import { validateRaceCourse } from '../../utility/data/common/raceCourse';
import type { RaceDateTime } from '../../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../../utility/data/common/raceDateTime';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';


export class PlaceRecord implements IRecord<PlaceRecord> {
    
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly updateDate: UpdateDate,
    ) {}

    
    public static create(
        id: PlaceId,
        raceType: RaceType,
        dateTime: Date,
        location: string,
        updateDate: Date,
    ): PlaceRecord {
        try {
            return new PlaceRecord(
                validatePlaceId(raceType, id),
                raceType,
                validateRaceDateTime(dateTime),
                validateRaceCourse(raceType, location),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create PlaceRecord', error),
            );
        }
    }

    
    public copy(partial: Partial<PlaceRecord> = {}): PlaceRecord {
        return PlaceRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.updateDate ?? this.updateDate,
        );
    }

    
    public toEntity(): HorseRacingPlaceEntity {
        return HorseRacingPlaceEntity.create(
            this.id,
            PlaceData.create(this.raceType, this.dateTime, this.location),
            this.updateDate,
        );
    }
}
