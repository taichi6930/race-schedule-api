import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';
import type { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';
import { inject, injectable } from 'tsyringe';

import type { IDBGateway } from '../../gateway/interface/IDBGateway';
import type { SearchRaceFilterParams } from '../../types/searchRaceFilter';
import type { IRaceRepository } from '../interface/IRaceRepository';

// RaceMapperの内容をこのファイル内に移植
const RaceMapper = {
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

/**
 * RaceRepositoryのDB実装
 */
@injectable()
export class RaceRepository implements IRaceRepository {
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}

    public async fetch(params: SearchRaceFilterParams): Promise<RaceEntity[]> {
        const sqlParams: any[] = [
            params.startDate.toISOString(),
            params.finishDate.toISOString(),
        ];

        // 基本カラム
        const selectColumns = [
            'r.race_id',
            'r.place_id',
            'r.race_type',
            'r.date_time',
            'r.location_code',
            'r.race_number',
            'pm.place_name',
        ];
        const joinClauses = [
            "LEFT JOIN place_master pm ON pm.race_type = r.race_type AND pm.course_code_type = 'default' AND pm.place_code = r.location_code",
        ];

        // JRAの場合 place_held_day を取得
        const isJRA = params.raceTypeList.includes('JRA');
        if (isJRA) {
            selectColumns.push('h.held_times', 'h.held_day_times');
            joinClauses.push(
                'LEFT JOIN place_held_day h ON r.place_id = h.place_id',
            );
        }

        let sql = `SELECT ${selectColumns.join(', ')} FROM race r\n${joinClauses.join('\n')}`;
        sql += ' WHERE r.date_time BETWEEN ? AND ?';

        if (params.raceTypeList.length > 0) {
            sql += ` AND r.race_type IN (${params.raceTypeList.map(() => '?').join(',')})`;
            sqlParams.push(...params.raceTypeList);
        }
        if (params.locationList && params.locationList.length > 0) {
            sql += ` AND r.location_code IN (${params.locationList.map(() => '?').join(',')})`;
            sqlParams.push(...params.locationList);
        }

        const { results } = await this.dbGateway.queryAll(sql, sqlParams);
        return results.map((row: any) => RaceMapper.toEntity(row));
    }

    public async upsert(entityList: RaceEntity[]): Promise<UpsertResult> {
        const result: UpsertResult = {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
        if (entityList.length === 0) return result;

        for (const e of entityList) {
            try {
                // race insert or update
                const insertRaceSql = `INSERT INTO race (race_id, place_id, race_type, date_time, location_code, race_number, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ON CONFLICT(race_id) DO UPDATE SET
                        place_id = excluded.place_id,
                        race_type = excluded.race_type,
                        date_time = excluded.date_time,
                        location_code = excluded.location_code,
                        race_number = excluded.race_number,
                        updated_at = CURRENT_TIMESTAMP`;
                const dateStr =
                    typeof e.datetime === 'string'
                        ? e.datetime
                        : e.datetime.toISOString();
                await this.dbGateway.run(insertRaceSql, [
                    e.raceId,
                    e.placeId,
                    e.raceType,
                    dateStr,
                    e.locationCode,
                    e.raceNumber,
                ]);
                result.successCount++;
            } catch (error: any) {
                result.failureCount++;
                result.failures.push({
                    db: 'race',
                    id: e.raceId,
                    reason: error?.message ?? String(error),
                });
            }
        }
        return result;
    }
}
