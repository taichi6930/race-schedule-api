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
                const sql = `INSERT INTO place (id, race_type, date_time, location_name) VALUES (?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET race_type=excluded.race_type, date_time=excluded.date_time, location_name=excluded.location_name`;
                await this.dbGateway.run(sql, [
                    entity.placeId,
                    entity.raceType,
                    entity.datetime.toISOString(),
                    entity.placeName,
                ]);
                successCount++;
            } catch (error: any) {
                failures.push({
                    db: 'place',
                    id: entity.placeId,
                    reason: error?.message ?? 'unknown error',
                });
            }
        }
        return {
            successCount,
            failureCount: failures.length,
            failures,
        };
    }
}
