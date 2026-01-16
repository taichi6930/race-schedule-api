import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';
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

    private toEntity(row: any): PlaceEntity {
        // D1公式APIとDrizzle ORMでカラム名が異なる場合に対応
        return {
            placeId: row.id,
            raceType: row.raceType ?? row.race_type,
            datetime: new Date(row.dateTime ?? row.date_time),
            locationCode: undefined,
            placeName: row.locationName ?? row.location_name,
            placeHeldDays: undefined,
        };
    }

    public async fetch(
        params: SearchPlaceFilterParams,
    ): Promise<PlaceEntity[]> {
        let sql = 'SELECT * FROM place WHERE date_time BETWEEN ? AND ?';
        const sqlParams: any[] = [
            params.startDate.toISOString(),
            params.finishDate.toISOString(),
        ];
        if (params.raceTypeList.length > 0) {
            sql += ` AND race_type IN (${params.raceTypeList.map(() => '?').join(',')})`;
            sqlParams.push(...params.raceTypeList);
        }
        if (params.locationList && params.locationList.length > 0) {
            sql += ` AND location_name IN (${params.locationList.map(() => '?').join(',')})`;
            sqlParams.push(...params.locationList);
        }
        const { results } = await this.dbGateway.queryAll(sql, sqlParams);
        return results.map((row: any) => this.toEntity(row));
    }

    public async upsert(entityList: PlaceEntity[]): Promise<UpsertResult> {
        let successCount = 0;
        const failures: { db: string; id: string; reason: string }[] = [];
        for (const entity of entityList) {
            try {
                // トランザクション開始
                await this.dbGateway.run('BEGIN', []);

                // place テーブルの upsert
                const placeSql = `INSERT INTO place (id, race_type, date_time, location_name, created_at, updated_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ON CONFLICT(id) DO UPDATE SET
                        race_type = excluded.race_type,
                        date_time = excluded.date_time,
                        location_name = excluded.location_name,
                        updated_at = CURRENT_TIMESTAMP`;
                await this.dbGateway.run(placeSql, [
                    entity.placeId,
                    entity.raceType,
                    entity.datetime.toISOString(),
                    entity.placeName,
                ]);

                // place_held_day がある場合は upsert
                if (entity.placeHeldDays) {
                    const heldSql = `INSERT INTO place_held_day (place_id, held_times, held_day_times, created_at, updated_at)
                        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        ON CONFLICT(place_id) DO UPDATE SET
                            held_times = excluded.held_times,
                            held_day_times = excluded.held_day_times,
                            updated_at = CURRENT_TIMESTAMP`;
                    await this.dbGateway.run(heldSql, [
                        entity.placeId,
                        entity.placeHeldDays.heldTimes,
                        entity.placeHeldDays.heldDayTimes,
                    ]);
                }

                // place_grade が渡されている場合は upsert（エンティティに grade プロパティがあれば対応）
                const maybeGrade = (entity as any).grade;
                if (maybeGrade !== undefined && maybeGrade !== null) {
                    const gradeSql = `INSERT INTO place_grade (id, race_type, grade, created_at, updated_at)
                        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        ON CONFLICT(id) DO UPDATE SET
                            race_type = excluded.race_type,
                            grade = excluded.grade,
                            updated_at = CURRENT_TIMESTAMP`;
                    await this.dbGateway.run(gradeSql, [
                        entity.placeId,
                        entity.raceType,
                        maybeGrade,
                    ]);
                }

                // place_master に関しては locationCode があれば upsert
                // 注意: schema の PRIMARY KEY は (race_type, course_code_type, place_name)
                // course_code_type の値が得られない場合は 'default' を使用しています。
                if (entity.locationCode) {
                    const masterSql = `INSERT INTO place_master (race_type, course_code_type, place_name, place_code, created_at, updated_at)
                        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        ON CONFLICT(race_type, course_code_type, place_name) DO UPDATE SET
                            place_code = excluded.place_code,
                            updated_at = CURRENT_TIMESTAMP`;
                    await this.dbGateway.run(masterSql, [
                        entity.raceType,
                        'default',
                        entity.placeName,
                        entity.locationCode,
                    ]);
                }

                // コミット
                await this.dbGateway.run('COMMIT', []);
                successCount++;
            } catch (error: any) {
                // エラー発生時はロールバックを試みる
                try {
                    await this.dbGateway.run('ROLLBACK', []);
                } catch (e) {
                    // ignore
                }
                failures.push({ db: 'place', id: entity.placeId, reason: error?.message ?? 'unknown error' });
            }
        }
        return {
            successCount,
            failureCount: failures.length,
            failures,
        };
    }
}
