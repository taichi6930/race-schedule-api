import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import type { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';

import type { IDBGateway } from '../../gateway/interface/IDBGateway';
import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * PlaceRepositoryのDB実装
 */

export class PlaceRepository implements IPlaceRepository {
    public constructor(private readonly dbGateway: IDBGateway) {}

    private toEntity(
        row: any,
        opts?: { includePlaceGrade?: boolean },
    ): PlaceEntity {
        const entity: any = {
            placeId: row.place_id,
            raceType: row.race_type,
            datetime: new Date(row.date_time),
            locationCode: row.location_code,
            locationName: row.place_name,
            placeHeldDays:
                row.held_times !== undefined && row.held_times !== null
                    ? {
                          heldTimes: row.held_times,
                          heldDayTimes: row.held_day_times,
                      }
                    : undefined,
        };
        if (
            opts?.includePlaceGrade &&
            row.place_grade !== undefined &&
            row.place_grade !== null
        ) {
            entity.placeGrade = row.place_grade;
        }
        return entity;
    }

    public async fetch(
        params: SearchPlaceFilterParams,
    ): Promise<PlaceEntity[]> {
        const sqlParams: any[] = [
            params.startDate.toISOString(),
            params.finishDate.toISOString(),
        ];

        let sql = `SELECT p.place_id, p.race_type, p.date_time, p.location_code, pm.place_name, g.place_grade, h.held_times, h.held_day_times
            FROM place p
            LEFT JOIN place_master pm ON pm.race_type = p.race_type AND pm.course_code_type = 'default' AND pm.place_code = p.location_code
            LEFT JOIN place_grade g ON g.place_id = p.place_id
            LEFT JOIN place_held_day h ON p.place_id = h.place_id
            WHERE p.date_time BETWEEN ? AND ?`;

        if (params.raceTypeList.length > 0) {
            sql += ` AND p.race_type IN (${params.raceTypeList.map(() => '?').join(',')})`;
            sqlParams.push(...params.raceTypeList);
        }
        if (params.locationList && params.locationList.length > 0) {
            sql += ` AND p.location_code IN (${params.locationList.map(() => '?').join(',')})`;
            sqlParams.push(...params.locationList);
        }

        const { results } = await this.dbGateway.queryAll(sql, sqlParams);
        return results.map((row: any) => this.toEntity(row));
    }

    public async upsert(entityList: PlaceEntity[]): Promise<UpsertResult> {
        const result: UpsertResult = {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
        if (entityList.length === 0) return result;

        for (const e of entityList) {
            try {
                // place insert or update
                const insertPlaceSql = `INSERT INTO place (place_id, race_type, date_time, location_code, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ON CONFLICT(place_id) DO UPDATE SET
                        race_type = excluded.race_type,
                        date_time = excluded.date_time,
                        location_code = excluded.location_code,
                        updated_at = CURRENT_TIMESTAMP`;
                const dateStr =
                    typeof e.datetime === 'string'
                        ? e.datetime
                        : e.datetime.toISOString();
                await this.dbGateway.run(insertPlaceSql, [
                    e.placeId,
                    e.raceType,
                    dateStr,
                    e.locationCode ?? e.placeName,
                ]);

                // place_held_day insert or update
                if (e.placeHeldDays) {
                    const insertHeldSql = `INSERT INTO place_held_day (place_id, held_times, held_day_times, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        ON CONFLICT(place_id) DO UPDATE SET
                            held_times = excluded.held_times,
                            held_day_times = excluded.held_day_times,
                            updated_at = CURRENT_TIMESTAMP`;
                    await this.dbGateway.run(insertHeldSql, [
                        e.placeId,
                        e.placeHeldDays.heldTimes,
                        e.placeHeldDays.heldDayTimes,
                    ]);
                }
                result.successCount++;
            } catch (error: any) {
                result.failureCount++;
                result.failures.push({
                    db: 'place',
                    id: e.placeId,
                    reason: error?.message ?? String(error),
                });
            }
        }
        return result;
    }
}
