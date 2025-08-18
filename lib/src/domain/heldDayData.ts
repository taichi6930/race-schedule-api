import {
    type heldDayTimes as HeldDayTimes,
    validateHeldDayTimes,
} from '../utility/data/common/heldDayTimes';
import {
    type HeldTimes,
    validateHeldTimes,
} from '../utility/data/common/heldTimes';


export class HeldDayData {
    
    public readonly heldTimes: HeldTimes;
    
    public readonly heldDayTimes: HeldDayTimes;

    
    private constructor(heldTimes: HeldTimes, heldDayTimes: HeldDayTimes) {
        this.heldTimes = heldTimes;
        this.heldDayTimes = heldDayTimes;
    }

    
    public static create(heldTimes: number, heldDayTimes: number): HeldDayData {
        return new HeldDayData(
            validateHeldTimes(heldTimes),
            validateHeldDayTimes(heldDayTimes),
        );
    }

    
    public copy(partial: Partial<HeldDayData> = {}): HeldDayData {
        return HeldDayData.create(
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
