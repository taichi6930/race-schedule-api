import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';

export const RaceMapper = {
    toEntity(row: unknown): RaceEntity {
        const r = row as Record<string, any>;
        const entity: RaceEntity = {
            raceId: r.race_id,
            placeId: r.place_id,
            raceType: r.race_type,
            datetime: new Date(r.date_time),
            locationCode: r.location_code,
            placeName: r.place_name ?? '',
            raceNumber: r.race_number,
            placeHeldDays:
                r.held_times !== undefined && r.held_times !== null
                    ? {
                          heldTimes: r.held_times,
                          heldDayTimes: r.held_day_times,
                      }
                    : undefined,
        };
        return entity;
    },
};
