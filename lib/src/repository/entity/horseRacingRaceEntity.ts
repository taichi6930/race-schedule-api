import '../../utility/format';

import type { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import type { RaceData } from '../../domain/raceData';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import {
    generateRaceId,
    type RaceId,
    validateRaceId,
} from '../../utility/data/common/raceId';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';


export class HorseRacingRaceEntity {
    
    private constructor(
        public readonly id: RaceId,
        public readonly raceData: RaceData,
        public readonly conditionData: HorseRaceConditionData,
        public readonly updateDate: UpdateDate,
    ) {}

    
    public static create(
        id: string,
        raceData: RaceData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): HorseRacingRaceEntity {
        return new HorseRacingRaceEntity(
            validateRaceId(raceData.raceType, id),
            raceData,
            conditionData,
            validateUpdateDate(updateDate),
        );
    }

    
    public static createWithoutId(
        raceData: RaceData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): HorseRacingRaceEntity {
        return HorseRacingRaceEntity.create(
            generateRaceId(
                raceData.raceType,
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
            conditionData,
            updateDate,
        );
    }

    
    public copy(
        partial: Partial<HorseRacingRaceEntity> = {},
    ): HorseRacingRaceEntity {
        return HorseRacingRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.conditionData ?? this.conditionData,
            partial.updateDate ?? this.updateDate,
        );
    }

    
    public toRaceRecord(): HorseRacingRaceRecord {
        return HorseRacingRaceRecord.create(
            this.id,
            this.raceData.raceType,
            this.raceData.name,
            this.raceData.dateTime,
            this.raceData.location,
            this.conditionData.surfaceType,
            this.conditionData.distance,
            this.raceData.grade,
            this.raceData.number,
            this.updateDate,
        );
    }
}
