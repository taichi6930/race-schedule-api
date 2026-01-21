import type { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * PlaceテーブルのDB行型定義
 */
export interface PlaceRow {
    place_id: string;
    race_type: RaceType;
    date_time: string;
    location_code: string;
    place_name: string;
    held_times?: number;
    held_day_times?: number;
    place_grade?: string;
}

/**
 * unknown型からPlaceRowへの型ガード
 */
export function isPlaceRow(row: unknown): row is PlaceRow {
    if (typeof row !== 'object' || row === null) {
        return false;
    }

    const r = row as Record<string, unknown>;

    return (
        typeof r.place_id === 'string' &&
        typeof r.race_type === 'string' &&
        typeof r.date_time === 'string' &&
        (typeof r.location_code === 'string' ||
            r.location_code === null ||
            r.location_code === undefined) &&
        (typeof r.place_name === 'string' ||
            r.place_name === null ||
            r.place_name === undefined)
    );
}
