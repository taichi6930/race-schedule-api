import type { HeldDayTimes } from '../types/heldDayTimes';
import type { HeldTimes } from '../types/heldTimes';
import type { LocationCode } from '../types/locationCode';
import type { PlaceId } from '../types/placeId';
import type { RaceType } from './../types/raceType';

export interface PlaceEntity {
    placeId: PlaceId; // 開催場ID
    raceType: RaceType; // レース種別
    datetime: Date; // 開催日付
    locationCode: LocationCode; // 開催場コード
    placeHeldDays: PlaceHeldDays | undefined; // 開催回数
}

export interface PlaceHeldDays {
    heldTimes: HeldTimes; // 開催回数
    heldDayTimes: HeldDayTimes; // 開催日数
}
