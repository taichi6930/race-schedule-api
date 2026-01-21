import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';

import type { PlaceRow } from '../types/placeRow';
import { isPlaceRow } from '../types/placeRow';

export const PlaceMapper = {
    toEntity(
        row: unknown,
        opts?: { includePlaceGrade?: boolean },
    ): PlaceEntity {
        if (!isPlaceRow(row)) {
            throw new Error('Invalid row data: expected PlaceRow');
        }

        const entity: PlaceEntity = {
            placeId: row.place_id,
            raceType: row.race_type,
            datetime: new Date(row.date_time),
            placeName: row.place_name ?? '',
            locationCode: row.location_code ?? undefined,
            placeGrade:
                opts?.includePlaceGrade &&
                row.place_grade !== undefined &&
                row.place_grade !== null
                    ? row.place_grade
                    : undefined,
            placeHeldDays:
                row.held_times !== undefined && row.held_times !== null
                    ? {
                          heldTimes: row.held_times,
                          heldDayTimes: row.held_day_times ?? 0,
                      }
                    : undefined,
        };

        return entity;
    },
};
