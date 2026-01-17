import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';

export const PlaceMapper = {
    toEntity(
        row: unknown,
        opts?: { includePlaceGrade?: boolean },
    ): PlaceEntity {
        const r = row as Record<string, any>;
        const entity: any = {
            placeId: r.place_id,
            raceType: r.race_type,
            datetime: new Date(r.date_time),
            locationCode: r.location_code,
            locationName: r.place_name,
            placeHeldDays:
                r.held_times !== undefined && r.held_times !== null
                    ? {
                          heldTimes: r.held_times,
                          heldDayTimes: r.held_day_times,
                      }
                    : undefined,
        };
        if (
            opts?.includePlaceGrade &&
            r.place_grade !== undefined &&
            r.place_grade !== null
        ) {
            entity.placeGrade = r.place_grade;
        }
        return entity;
    },
};
