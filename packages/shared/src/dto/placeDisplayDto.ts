import type { PlaceHeldDays } from '../entity/placeEntity';
import type { PlaceId } from '../types/placeId';
import type { RaceType } from '../types/raceType';

/**
 * API表示用の開催場DTO
 */
export interface PlaceDisplayDto {
    placeId: PlaceId;
    raceType: RaceType;
    datetime: Date;
    placeName: string;
    placeGrade: string | undefined;
    placeHeldDays: PlaceHeldDays | undefined;
}
