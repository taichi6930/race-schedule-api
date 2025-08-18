import {
    type heldDayTimes,
    validateHeldDayTimes,
} from '../../utility/data/common/heldDayTimes';
import type { HeldTimes } from '../../utility/data/common/heldTimes';
import { validateHeldTimes } from '../../utility/data/common/heldTimes';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';


export class HeldDayRecord implements IRecord<HeldDayRecord> {
    
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly heldTimes: HeldTimes,
        public readonly heldDayTimes: heldDayTimes,
        public readonly updateDate: UpdateDate,
    ) {}

    
    public static create(
        id: string,
        raceType: RaceType,
        heldTimes: number,
        heldDayTimes: number,
        updateDate: Date,
    ): HeldDayRecord {
        try {
            return new HeldDayRecord(
                validatePlaceId(raceType, id),
                raceType,
                validateHeldTimes(heldTimes),
                validateHeldDayTimes(heldDayTimes),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('JraHeldDayRecord create error', error),
            );
        }
    }

    
    public copy(partial: Partial<HeldDayRecord> = {}): HeldDayRecord {
        return HeldDayRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
            partial.updateDate ?? this.updateDate,
        );
    }
}
