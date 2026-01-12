import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { IDBGateway } from '../../../packages/api/src/gateway/interface/IDBGateway';
import { Logger } from '../../../packages/shared/src/utilities/logger';
import type {
    FailureDetail,
    UpsertResult,
} from '../../../packages/shared/src/utilities/upsertResult';
import { HeldDayData } from '../../domain/heldDayData';
import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import {
    isIncludedRaceType,
    RACE_TYPE_LIST_HORSE_RACING,
    RACE_TYPE_LIST_MECHANICAL_RACING,
    validateRaceType,
} from '../../utility/raceType';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { RaceEntity } from '../entity/raceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class RaceRepositoryFromStorage implements IRaceRepository {
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}
    @Logger
    public async fetchRaceEntityList(
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        const { raceTypeList, startDate, finishDate, locationList, gradeList } =
            searchRaceFilter;

        // WHERE句とパラメータ生成を関数化
        const buildWhereClauseAndParams = (): {
            clause: string;
            params: any[];
        } => {
            const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
            const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');
            const raceTypePlaceholders = raceTypeList.map(() => '?').join(', ');
            let clause = `WHERE race.race_type IN (${raceTypePlaceholders}) AND race.date_time >= ? AND race.date_time <= ?`;
            const params: any[] = [
                ...raceTypeList,
                startDateFormatted,
                finishDateFormatted,
            ];
            if (locationList.length > 0) {
                const locationPlaceholders = locationList
                    .map(() => '?')
                    .join(', ');
                clause += ` AND race.location_name IN (${locationPlaceholders})`;
                params.push(...locationList);
            }
            if (gradeList.length > 0) {
                const gradePlaceholders = gradeList.map(() => '?').join(', ');
                clause += ` AND race.grade IN (${gradePlaceholders})`;
                params.push(...gradeList);
            }
            return { clause, params };
        };

        const { clause: whereClause, params: queryParams } =
            buildWhereClauseAndParams();

        const sql = `
            SELECT
                race.id,
                race.place_id,
                race.race_type,
                race.race_name,
                race.date_time,
                race.location_name,
                race_condition.surface_type,
                race_condition.distance,
                race.grade,
                race.race_number,
                held_day.held_times,
                held_day.held_day_times,
                race_stage.stage,
                race.created_at,
                race.updated_at
            FROM race
            LEFT JOIN race_condition ON race.id = race_condition.id
            LEFT JOIN held_day ON race.place_id = held_day.id
            LEFT JOIN race_stage ON race.id = race_stage.id
            ${whereClause}
        `;
        console.log(sql, queryParams);

        const { results } = await this.dbGateway.queryAll(sql, queryParams);

        return results.map((row: any): RaceEntity => {
            const dateJST = new Date(row.date_time);
            const heldDayData =
                row.held_times !== null && row.held_day_times !== null
                    ? HeldDayData.create(
                          Number(row.held_times),
                          Number(row.held_day_times),
                      )
                    : undefined;
            const conditionData =
                row.surface_type !== null && row.distance !== null
                    ? HorseRaceConditionData.create(
                          row.surface_type,
                          row.distance,
                      )
                    : undefined;
            const raceType = validateRaceType(row.race_type);
            const racePlayerList = isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            )
                ? []
                : undefined;
            const stage = isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            )
                ? row.stage
                : undefined;
            return RaceEntity.create(
                row.id,
                row.place_id,
                RaceData.create(
                    row.race_type,
                    row.race_name,
                    dateJST,
                    row.location_name,
                    row.grade,
                    row.race_number,
                ),
                heldDayData,
                conditionData,
                stage,
                racePlayerList,
            );
        });
    }

    @Logger
    public async upsertRaceEntityList(
        entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        const result: UpsertResult = {
            successCount: 0,
            failureCount: 0,
            failures: [] as FailureDetail[],
        };
        const chunkSize = 5;
        // chunk分割関数
        const chunkArray = <T>(array: T[], size: number): T[][] => {
            const chunks: T[][] = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        };

        // raceテーブル バルクinsert
        for (const chunk of chunkArray(entityList, chunkSize)) {
            const insertRaceSql = `
                INSERT INTO race (
                    id,
                    place_id,
                    race_type,
                    race_name,
                    date_time,
                    location_name,
                    grade,
                    race_number,
                    created_at,
                    updated_at
                ) VALUES
                    ${chunk.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(id) DO UPDATE SET
                    race_type = excluded.race_type,
                    race_name = excluded.race_name,
                    date_time = excluded.date_time,
                    location_name = excluded.location_name,
                    grade = excluded.grade,
                    place_id = excluded.place_id,
                    race_number = excluded.race_number,
                    updated_at = CURRENT_TIMESTAMP
            `;
            const raceParams: any[] = [];
            for (const entity of chunk) {
                const { id, placeId, raceData } = entity;
                const dateJST = new Date(new Date(raceData.dateTime));
                const dateTimeStr = formatDate(dateJST, 'yyyy-MM-dd HH:mm:ss');
                raceParams.push(
                    id,
                    placeId,
                    raceData.raceType,
                    raceData.name,
                    dateTimeStr,
                    raceData.location,
                    raceData.grade,
                    raceData.number,
                );
            }
            try {
                await this.dbGateway.run(insertRaceSql, raceParams);
                await new Promise((resolve) => setTimeout(resolve, 500));
                result.successCount += chunk.length;
            } catch (error: any) {
                result.failureCount += chunk.length;
                for (const entity of chunk) {
                    result.failures.push({
                        db: 'race',
                        id: entity.id,
                        reason: error?.message ?? String(error),
                    });
                }
            }
        }

        // race_condition バルクinsert（JRA/NAR/OVERSEASのみ）
        const conditionEntities = entityList.filter((e) =>
            isIncludedRaceType(
                e.raceData.raceType,
                RACE_TYPE_LIST_HORSE_RACING,
            ),
        );
        for (const chunk of chunkArray(conditionEntities, chunkSize)) {
            if (chunk.length === 0) continue;
            const insertConditionSql = `
                INSERT INTO race_condition (
                    id,
                    race_type,
                    surface_type,
                    distance,
                    created_at,
                    updated_at
                ) VALUES
                    ${chunk.map(() => '(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(id) DO UPDATE SET
                    race_type = excluded.race_type,
                    surface_type = excluded.surface_type,
                    distance = excluded.distance,
                    updated_at=CURRENT_TIMESTAMP
            `;
            const conditionParams: any[] = [];
            for (const entity of chunk) {
                conditionParams.push(
                    entity.id,
                    entity.raceData.raceType,
                    entity.conditionData.surfaceType,
                    entity.conditionData.distance,
                );
            }
            try {
                await this.dbGateway.run(insertConditionSql, conditionParams);
                await new Promise((resolve) => setTimeout(resolve, 500));
                result.successCount += chunk.length;
            } catch (error: any) {
                result.failureCount += chunk.length;
                for (const entity of chunk) {
                    result.failures.push({
                        db: 'race_condition',
                        id: entity.id,
                        reason: error?.message ?? String(error),
                    });
                }
            }
        }

        // race_stage バルクinsert（KEIRIN/AUTORACE/BOATRACEのみ）
        const stageEntities = entityList.filter((e) =>
            isIncludedRaceType(
                e.raceData.raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            ),
        );
        for (const chunk of chunkArray(stageEntities, chunkSize)) {
            if (chunk.length === 0) continue;
            const insertStageSql = `
                INSERT INTO race_stage (
                    id,
                    race_type,
                    stage,
                    created_at,
                    updated_at
                ) VALUES
                    ${chunk.map(() => '(?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').join(',\n')}
                ON CONFLICT(id) DO UPDATE SET
                    race_type = excluded.race_type,
                    stage = excluded.stage,
                    updated_at=CURRENT_TIMESTAMP
            `;
            const stageParams: any[] = [];
            for (const entity of chunk) {
                stageParams.push(
                    entity.id,
                    entity.raceData.raceType,
                    entity.stage,
                );
            }
            try {
                await this.dbGateway.run(insertStageSql, stageParams);
                await new Promise((resolve) => setTimeout(resolve, 500));
                result.successCount += chunk.length;
            } catch (error: any) {
                result.failureCount += chunk.length;
                for (const entity of chunk) {
                    result.failures.push({
                        db: 'race_stage',
                        id: entity.id,
                        reason: error?.message ?? String(error),
                    });
                }
            }
        }
        return result;
    }
}
