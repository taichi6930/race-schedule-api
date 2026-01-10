import type { LocationCode } from '../types/locationCode';
import type { PlaceId } from '../types/placeId';
import type { RaceType } from './../types/raceType';

export interface PlaceEntity {
    placeId: PlaceId;
    raceType: RaceType;
    datetime: Date;
    locationCode: LocationCode; // 開催場コード
}
