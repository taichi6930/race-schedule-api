import type { LocationCode } from '../types/locationCode';
import type { PlaceId } from '../types/placeId';
import type { RaceType } from './../types/raceType';

export interface PlaceEntity {
    placeId: PlaceId; // 開催場ID
    raceType: RaceType; // レース種別
    datetime: Date; // 開催日付
    locationCode: LocationCode; // 開催場コード
}
