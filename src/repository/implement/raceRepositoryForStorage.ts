import { formatDate } from 'date-fns';

import { HeldDayData } from '../../domain/heldDayData';
import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import type { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { RaceEntity } from '../entity/raceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

export class RaceRepositoryForStorage implements IRaceRepository {
    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        const fetchRaceEntityListForJra = await this.fetchRaceEntityListForJra(
            commonParameter,
            searchRaceFilter,
        );
        const fetchRaceEntityListForNarAndOverseas =
            await this.fetchRaceEntityListForNarAndOverseas(
                commonParameter,
                searchRaceFilter,
            );
        return [
            ...fetchRaceEntityListForJra,
            ...fetchRaceEntityListForNarAndOverseas,
        ];
    }

    @Logger
    private async fetchRaceEntityListForJra(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        const { env } = commonParameter;
        const { raceTypeList, startDate, finishDate, locationList, gradeList } =
            searchRaceFilter;

        const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
        const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');

        // raceTypeListの数に応じて動的にWHERE句を生成
        const raceTypePlaceholders = raceTypeList.map(() => '?').join(', ');
        let whereClause = `WHERE race.race_type IN (${raceTypePlaceholders}) AND race.date_time >= ? AND race.date_time <= ?`;

        const queryParams: any[] = [];
        queryParams.push(
            ...raceTypeList,
            startDateFormatted,
            finishDateFormatted,
        );

        if (locationList.length > 0) {
            const locationPlaceholders = locationList.map(() => '?').join(', ');
            whereClause += ` AND place.location_name IN (${locationPlaceholders})`;
            queryParams.push(...locationList);
        }
        if (gradeList.length > 0) {
            const gradePlaceholders = gradeList.map(() => '?').join(', ');
            whereClause += ` AND race.grade IN (${gradePlaceholders})`;
            queryParams.push(...gradeList);
        }

        const { results } = await env.DB.prepare(
            `
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
                race.created_at,
                race.updated_at
            FROM race
            INNER JOIN race_condition ON race.id = race_condition.id
            LEFT JOIN held_day ON race.place_id = held_day.id
            ${whereClause}`,
        )
            .bind(...queryParams)
            .all();
        return results.map((row: any): RaceEntity => {
            const dateJST = new Date(new Date(row.date_time));
            const heldDayData =
                row.held_times !== null && row.held_day_times !== null
                    ? HeldDayData.create(
                          Number(row.held_times),
                          Number(row.held_day_times),
                      )
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
                HorseRaceConditionData.create(row.surface_type, row.distance),
                undefined, // TODO: stageを設定する
                undefined, // TODO: racePlayerDataListを設定する
            );
        });
    }

    @Logger
    private async fetchRaceEntityListForNarAndOverseas(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        const { env } = commonParameter;
        const { raceTypeList, startDate, finishDate, locationList, gradeList } =
            searchRaceFilter;

        const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
        const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');

        // raceTypeListの数に応じて動的にWHERE句を生成
        const raceTypePlaceholders = raceTypeList.map(() => '?').join(', ');
        let whereClause = `WHERE race.race_type IN (${raceTypePlaceholders}) AND race.date_time >= ? AND race.date_time <= ?`;

        const queryParams: any[] = [];
        queryParams.push(
            ...raceTypeList,
            startDateFormatted,
            finishDateFormatted,
        );

        if (locationList.length > 0) {
            const locationPlaceholders = locationList.map(() => '?').join(', ');
            whereClause += ` AND place.location_name IN (${locationPlaceholders})`;
            queryParams.push(...locationList);
        }

        if (gradeList.length > 0) {
            const gradePlaceholders = gradeList.map(() => '?').join(', ');
            whereClause += ` AND race.grade IN (${gradePlaceholders})`;
            queryParams.push(...gradeList);
        }

        const { results } = await env.DB.prepare(
            `
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
                race.created_at,
                race.updated_at
            FROM race
            INNER JOIN race_condition ON race.id = race_condition.id
            LEFT JOIN held_day ON race.place_id = held_day.id
            ${whereClause}`,
        )
            .bind(...queryParams)
            .all();
        return results.map((row: any): RaceEntity => {
            const dateJST = new Date(new Date(row.date_time));
            const heldDayData =
                row.held_times !== null && row.held_day_times !== null
                    ? HeldDayData.create(
                          Number(row.held_times),
                          Number(row.held_day_times),
                      )
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
                HorseRaceConditionData.create(row.surface_type, row.distance),
                undefined, // TODO: stageを設定する
                undefined, // TODO: racePlayerDataListを設定する
            );
        });
    }

    @Logger
    public async upsertRaceEntityList(
        commonParameter: CommonParameter,
        entityList: RaceEntity[],
    ): Promise<void> {
        const { env } = commonParameter;
        const insertStmt = env.DB.prepare(
            `
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                race_type = excluded.race_type,
                race_name = excluded.race_name,
                date_time = excluded.date_time,
                location_name = excluded.location_name,
                grade = excluded.grade,
                place_id = excluded.place_id,
                race_number = excluded.race_number,
                updated_at = CURRENT_TIMESTAMP
            `,
        );
        const insertConditionStmt = env.DB.prepare(
            `
            INSERT INTO race_condition (
                id,
                race_type,
                surface_type,
                distance,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                race_type = excluded.race_type,
                surface_type = excluded.surface_type,
                distance = excluded.distance,
                updated_at=CURRENT_TIMESTAMP
            `,
        );
        for (const entity of entityList) {
            const { id, placeId, raceData, conditionData } = entity;
            // JST変換
            const dateJST = new Date(new Date(raceData.dateTime));
            const dateTimeStr = formatDate(dateJST, 'yyyy-MM-dd HH:mm:ss');
            await insertStmt
                .bind(
                    id,
                    placeId,
                    raceData.raceType,
                    raceData.name,
                    dateTimeStr,
                    raceData.location,
                    raceData.grade,
                    raceData.number,
                )
                .run();
            await insertConditionStmt
                .bind(
                    id,
                    raceData.raceType,
                    conditionData.surfaceType,
                    conditionData.distance,
                )
                .run();
        }
    }
}
