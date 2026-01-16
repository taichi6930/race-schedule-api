import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import type { IDBGateway } from '../../gateway/interface/IDBGateway';
import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * PlaceRepositoryのDB実装
 */
@injectable()
export class PlaceRepository implements IPlaceRepository {
    /**
     * @param dbGateway DBアクセス用ゲートウェイ（D1/ローカルで切り替え）
     */
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}

    private toEntity(
        row: any,
        opts?: { includePlaceGrade?: boolean },
    ): PlaceEntity {
        // D1公式APIとDrizzle ORMでカラム名が異なる場合に対応
        const entity: any = {
            placeId: row.place_id,
            raceType: row.race_type,
            datetime: new Date(row.date_time),
            locationCode: row.location_code,
            locationName: row.place_name, // 出力名をlocationNameに
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

        const isOnlyJRA =
            params.raceTypeList.length === 1 &&
            params.raceTypeList[0] === RaceType.JRA;

        const wantMinimalHeldDays =
            isOnlyJRA && params.isDisplayPlaceHeldDays === false;

        // base select with place_master join to get place_name, and place_grade
        let sql = `SELECT p.place_id, p.race_type, p.date_time, p.location_code, pm.place_name, g.place_grade`;
        if (!wantMinimalHeldDays) {
            sql += ', h.held_times, h.held_day_times';
        }
        sql += ` FROM place p
            LEFT JOIN place_master pm ON pm.race_type = p.race_type AND pm.course_code_type = 'default' AND pm.place_code = p.location_code
            LEFT JOIN place_grade g ON g.place_id = p.place_id`;
        if (!wantMinimalHeldDays) {
            sql += ' LEFT JOIN place_held_day h ON p.place_id = h.place_id';
        }
        sql += ' WHERE p.date_time BETWEEN ? AND ?';

        if (params.raceTypeList.length > 0) {
            sql += ` AND p.race_type IN (${params.raceTypeList.map(() => '?').join(',')})`;
            sqlParams.push(...params.raceTypeList);
        }
        if (params.locationList && params.locationList.length > 0) {
            sql += ` AND p.location_code IN (${params.locationList.map(() => '?').join(',')})`;
            sqlParams.push(...params.locationList);
        }

        const { results } = await this.dbGateway.queryAll(sql, sqlParams);

        // KEIRIN, BOATRACE, AUTORACE の場合のplaceGrade出し分け
        const shouldIncludePlaceGrade = (raceType: string): boolean => {
            // isDisplayPlaceGradeがtrueまたはundefinedなら常に表示
            if (
                params.isDisplayPlaceGrade === undefined ||
                params.isDisplayPlaceGrade
            ) {
                return true;
            }
            // falseの場合はKEIRIN,BOATRACE,AUTORACEのみ非表示
            return !(
                raceType === 'KEIRIN' ||
                raceType === 'BOATRACE' ||
                raceType === 'AUTORACE'
            );
        };

        return results.map((row: any) =>
            this.toEntity(row, {
                includePlaceGrade: shouldIncludePlaceGrade(row.race_type),
            }),
        );
    }

    public async upsert(entityList: PlaceEntity[]): Promise<UpsertResult> {
        const result: UpsertResult = {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
        if (entityList.length === 0) return result;

        const chunkArray = <T>(array: T[], size: number): T[][] => {
            const res: T[][] = [];
            for (let i = 0; i < array.length; i += size)
                res.push(array.slice(i, i + size));
            return res;
        };

        const chunkSize = 10;

        // place バルク insert
        for (const chunk of chunkArray(entityList, chunkSize)) {
            const insertPlaceSql = `INSERT INTO place (place_id, race_type, date_time, location_code, created_at, updated_at) VALUES
                ${chunk.map(() => '(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(place_id) DO UPDATE SET
                    race_type = excluded.race_type,
                    date_time = excluded.date_time,
                    location_code = excluded.location_code,
                    updated_at = CURRENT_TIMESTAMP`;
            const params: any[] = [];
            for (const e of chunk) {
                const dateStr = formatDate(
                    new Date(e.datetime),
                    'yyyy-MM-dd HH:mm:ss',
                );
                params.push(
                    e.placeId,
                    e.raceType,
                    dateStr,
                    e.locationCode ?? e.placeName,
                );
            }
            try {
                await this.dbGateway.run(insertPlaceSql, params);
                await new Promise((r) => setTimeout(r, 200));
                result.successCount += chunk.length;
            } catch (error: any) {
                result.failureCount += chunk.length;
                for (const e of chunk)
                    result.failures.push({
                        db: 'place',
                        id: e.placeId,
                        reason: error?.message ?? String(error),
                    });
            }
        }

        // place_held_day バルク insert
        const heldEntities = entityList.filter(
            (
                e,
            ): e is PlaceEntity & {
                placeHeldDays: NonNullable<PlaceEntity['placeHeldDays']>;
            } => e.placeHeldDays !== undefined,
        );
        for (const chunk of chunkArray(heldEntities, chunkSize)) {
            const insertHeldSql = `INSERT INTO place_held_day (place_id, held_times, held_day_times, created_at, updated_at) VALUES
                ${chunk.map(() => '(?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(place_id) DO UPDATE SET
                    held_times = excluded.held_times,
                    held_day_times = excluded.held_day_times,
                    updated_at = CURRENT_TIMESTAMP`;
            const params: any[] = [];
            for (const e of chunk)
                params.push(
                    e.placeId,
                    e.placeHeldDays.heldTimes,
                    e.placeHeldDays.heldDayTimes,
                );
            try {
                await this.dbGateway.run(insertHeldSql, params);
                await new Promise((r) => setTimeout(r, 200));
                result.successCount += chunk.length;
            } catch (error: any) {
                result.failureCount += chunk.length;
                for (const e of chunk)
                    result.failures.push({
                        db: 'place_held_day',
                        id: e.placeId,
                        reason: error?.message ?? String(error),
                    });
            }
        }

        // place_grade バルク insert
        const gradeEntities = entityList.filter(
            (e) => (e as any).grade !== undefined && (e as any).grade !== null,
        );
        for (const chunk of chunkArray(gradeEntities, chunkSize)) {
            const insertGradeSql = `INSERT INTO place_grade (place_id, place_grade, created_at, updated_at) VALUES
                ${chunk.map(() => '(?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(place_id) DO UPDATE SET
                    place_grade = excluded.place_grade,
                    updated_at = CURRENT_TIMESTAMP`;
            const params: any[] = [];
            for (const e of chunk) params.push(e.placeId, (e as any).grade);
            try {
                await this.dbGateway.run(insertGradeSql, params);
                await new Promise((r) => setTimeout(r, 200));
                result.successCount += chunk.length;
            } catch (error: any) {
                result.failureCount += chunk.length;
                for (const e of chunk)
                    result.failures.push({
                        db: 'place_grade',
                        id: e.placeId,
                        reason: error?.message ?? String(error),
                    });
            }
        }

        // place_master 個別 upsert
        for (const e of entityList) {
            if (!(e.locationCode || e.placeName)) continue;
            const masterSql = `INSERT INTO place_master (race_type, course_code_type, place_name, place_code, created_at, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT(race_type, course_code_type, place_name) DO UPDATE SET
                    place_code = excluded.place_code,
                    updated_at = CURRENT_TIMESTAMP`;
            try {
                await this.dbGateway.run(masterSql, [
                    e.raceType,
                    'default',
                    e.placeName,
                    e.locationCode ?? e.placeName,
                ]);
            } catch (error: any) {
                result.failureCount += 1;
                result.failures.push({
                    db: 'place_master',
                    id: e.placeId,
                    reason: error?.message ?? String(error),
                });
            }
        }

        return result;
    }
}
