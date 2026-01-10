import type { PlaceId } from '../types/placeId';
import type { RaceType } from './../types/raceType';

export interface PlaceEntity {
    placeId: PlaceId;
    raceType: RaceType;
    datetime: Date;
    // TODO: locationCodeの型を作る
    locationCode: string; // 開催場コード
}
