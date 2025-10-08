import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import type { IDBGateway } from '../../gateway/interface/iDbGateway';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { FailureDetail, UpsertResult } from '../../utility/upsertResult';
import { SearchPlaceFilterEntity } from '../entity/filter/searchPlaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class PlaceRepositoryFromStorage implements IPlaceRepository {
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}
    @Logger
    public async fetchPlaceEntityList(
        searchPlaceFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        const { raceTypeList, startDate, finishDate, locationList } =
            searchPlaceFilter;
        if (raceTypeList.length === 0) {
            return [];
        }
        const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
        const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');
        const raceTypePlaceholders = raceTypeList.map(() => '?').join(', ');
        let whereClause = `WHERE place.race_type IN (${raceTypePlaceholders}) AND place.date_time >= ? AND place.date_time <= ?`;
        const queryParams: any[] = [
            ...raceTypeList,
            startDateFormatted,
            finishDateFormatted,
        ];
        if (locationList.length > 0) {
            const locationPlaceholders = locationList.map(() => '?').join(', ');
            whereClause += ` AND place.location_name IN (${locationPlaceholders})`;
            queryParams.push(...locationList);
        }
        const selectSQL = `
            SELECT
                place.id,
                place.race_type,
                place.date_time,
                place.location_name,
                held_day.held_times,
                held_day.held_day_times,
                place_grade.grade,
                place.created_at,
                place.updated_at
        `;
        const fromSQL = `FROM place
            LEFT JOIN held_day ON place.id = held_day.id
            LEFT JOIN place_grade ON place.id = place_grade.id`;
        const finalSQL = `
            ${selectSQL}
            ${fromSQL}
            ${whereClause}
        `;
        const { results } = await this.dbGateway.queryAll(
            finalSQL,
            queryParams,
        );
        return results
            .map((row: any): PlaceEntity | undefined => {
                try {
                    const dateJST = new Date(new Date(row.date_time));
                    const heldDayData =
                        row.held_times !== null && row.held_day_times !== null
                            ? HeldDayData.create(
                                  Number(row.held_times),
                                  Number(row.held_day_times),
                              )
                            : undefined;
                    const grade = row.grade ?? undefined;
                    return PlaceEntity.create(
                        row.id,
                        PlaceData.create(
                            row.race_type,
                            dateJST,
                            row.location_name,
                        ),
                        heldDayData,
                        grade,
                    );
                } catch (error) {
                    console.error('データのパースに失敗しました', row, error);
                    return undefined;
                }
            })
            .filter((entity): entity is PlaceEntity => entity !== undefined);
    }

    @Logger
    public async upsertPlaceEntityList(
        entityList: PlaceEntity[],
    ): Promise<UpsertResult> {
        const upsertResult: UpsertResult = {
            successCount: 0,
            failureCount: 0,
            failures: [] as FailureDetail[],
        };
        const chunkSize = 10;
        // chunk分割関数
        const chunkArray = <T>(array: T[], size: number): T[][] => {
            const result: T[][] = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        };

        if (entityList.length === 0) return upsertResult;
        // placeテーブル バルクinsert
        for (const chunk of chunkArray(entityList, chunkSize)) {
            const insertPlaceSql = `
                INSERT INTO place (
                    id,
                    race_type,
                    date_time,
                    location_name,
                    created_at,
                    updated_at
                ) VALUES
                    ${chunk.map(() => '(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(id) DO UPDATE SET
                    race_type = excluded.race_type,
                    date_time = excluded.date_time,
                    location_name = excluded.location_name,
                    updated_at = CURRENT_TIMESTAMP
            `;
            const placeParams: any[] = [];
            for (const entity of chunk) {
                const { id, placeData } = entity;
                const dateJST = new Date(new Date(placeData.dateTime));
                const dateTimeStr = formatDate(dateJST, 'yyyy-MM-dd HH:mm:ss');
                placeParams.push(
                    id,
                    placeData.raceType,
                    dateTimeStr,
                    placeData.location,
                );
            }
            try {
                await this.dbGateway.run(insertPlaceSql, placeParams);
                await new Promise((resolve) => setTimeout(resolve, 500));
                upsertResult.successCount += chunk.length;
            } catch (error: any) {
                upsertResult.failureCount += chunk.length;
                for (const entity of chunk) {
                    upsertResult.failures.push({
                        db: 'place',
                        id: entity.id,
                        reason: error?.message ?? String(error),
                    });
                }
            }
        }

        // held_day バルクinsert（JRAのみ）
        const heldDayEntities = entityList.filter(
            (e) => e.placeData.raceType === RaceType.JRA,
        );
        for (const chunk of chunkArray(heldDayEntities, chunkSize)) {
            if (chunk.length === 0) continue;
            const insertHeldDaySql = `
                INSERT INTO held_day (
                    id,
                    race_type,
                    held_times,
                    held_day_times,
                    created_at,
                    updated_at
                ) VALUES
                    ${chunk.map(() => '(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(id) DO UPDATE SET
                    race_type = excluded.race_type,
                    held_times = excluded.held_times,
                    held_day_times = excluded.held_day_times,
                    updated_at = CURRENT_TIMESTAMP
            `;
            const heldDayParams: any[] = [];
            for (const entity of chunk) {
                heldDayParams.push(
                    entity.id,
                    entity.placeData.raceType,
                    entity.heldDayData.heldTimes,
                    entity.heldDayData.heldDayTimes,
                );
            }
            try {
                await this.dbGateway.run(insertHeldDaySql, heldDayParams);
                await new Promise((resolve) => setTimeout(resolve, 500));
                upsertResult.successCount += chunk.length;
            } catch (error: any) {
                upsertResult.failureCount += chunk.length;
                for (const entity of chunk) {
                    upsertResult.failures.push({
                        db: 'place',
                        id: entity.id,
                        reason: error?.message ?? String(error),
                    });
                }
            }
        }

        // place_grade バルクinsert（KEIRIN/AUTORACE/BOATRACEのみ）
        const gradeEntities = entityList.filter(
            (e) =>
                e.placeData.raceType === RaceType.KEIRIN ||
                e.placeData.raceType === RaceType.AUTORACE ||
                e.placeData.raceType === RaceType.BOATRACE,
        );
        for (const chunk of chunkArray(gradeEntities, chunkSize)) {
            if (chunk.length === 0) continue;
            const insertGradeSql = `
                INSERT INTO place_grade (
                    id,
                    race_type,
                    grade,
                    created_at,
                    updated_at
                ) VALUES
                    ${chunk.map(() => '(?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(id) DO UPDATE SET
                    race_type = excluded.race_type,
                    grade = excluded.grade,
                    updated_at = CURRENT_TIMESTAMP
            `;
            const gradeParams: any[] = [];
            for (const entity of chunk) {
                gradeParams.push(
                    entity.id,
                    entity.placeData.raceType,
                    entity.grade,
                );
            }
            try {
                await this.dbGateway.run(insertGradeSql, gradeParams);
                await new Promise((resolve) => setTimeout(resolve, 500));
                upsertResult.successCount += chunk.length;
            } catch (error: any) {
                upsertResult.failureCount += chunk.length;
                for (const entity of chunk) {
                    upsertResult.failures.push({
                        db: 'place',
                        id: entity.id,
                        reason: error?.message ?? String(error),
                    });
                }
            }
        }
        return upsertResult;
    }
}
