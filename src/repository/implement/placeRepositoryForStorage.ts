import { formatDate } from 'date-fns';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import type { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

export class PlaceRepositoryForStorage implements IPlaceRepository {
    @Logger
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        return this.fetchPlaceEntityListByType(
            commonParameter,
            searchRaceFilter,
        );
    }

    @Logger
    private async fetchPlaceEntityListByType(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        const { env } = commonParameter;
        const { raceTypeList, startDate, finishDate } = searchRaceFilter;
        if (raceTypeList.length === 0) {
            return [];
        }
        const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
        const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');
        const raceTypePlaceholders = raceTypeList.map(() => '?').join(', ');
        const whereClause = `WHERE place.race_type IN (${raceTypePlaceholders}) AND place.date_time >= ? AND place.date_time <= ?`;
        const queryParams: any[] = [];
        queryParams.push(
            ...raceTypeList,
            startDateFormatted,
            finishDateFormatted,
        );
        const selectSQL = `
            SELECT
                place.id,
                place.race_type,
                place.date_time,
                place.location_name,
                held_day.held_times,
                held_day.held_day_times,
                place.created_at,
                place.updated_at
        `;
        const fromSQL = `FROM place LEFT JOIN held_day ON place.id = held_day.id`;
        const { results } = await env.DB.prepare(
            `
            ${selectSQL}
            ${fromSQL}
            ${whereClause}
            `,
        )
            .bind(...queryParams)
            .all();
        return results.map((row: any): PlaceEntity => {
            const dateJST = new Date(new Date(row.date_time));
            const heldDayData =
                row.held_times !== undefined && row.held_day_times !== undefined
                    ? HeldDayData.create(row.held_times, row.held_day_times)
                    : undefined;
            return PlaceEntity.create(
                row.id,
                PlaceData.create(row.race_type, dateJST, row.location_name),
                heldDayData,
                undefined, // TODO: gradeを設定する
            );
        });
    }

    @Logger
    public async upsertPlaceEntityList(
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ): Promise<void> {
        const { env } = commonParameter;
        const insertStmt = env.DB.prepare(
            `
            INSERT INTO place (
                id,
                race_type,
                date_time,
                location_name,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                race_type = excluded.race_type,
                date_time = excluded.date_time,
                location_name = excluded.location_name,
                updated_at = CURRENT_TIMESTAMP
            `,
        );
        const insertHeldDayStmt = env.DB.prepare(
            `
            INSERT INTO held_day (
                id,
                race_type,
                held_times,
                held_day_times,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                race_type = excluded.race_type,
                held_times = excluded.held_times,
                held_day_times = excluded.held_day_times,
                updated_at = CURRENT_TIMESTAMP
            `,
        );
        // トランザクション開始
        for (const entity of entityList) {
            const { id, placeData } = entity;
            // JST変換
            const dateJST = new Date(new Date(placeData.dateTime));
            const dateTimeStr = formatDate(dateJST, 'yyyy-MM-dd HH:mm:ss');
            await insertStmt
                .bind(id, placeData.raceType, dateTimeStr, placeData.location)
                .run();
            if (placeData.raceType === RaceType.JRA) {
                const { heldDayData } = entity;
                await insertHeldDayStmt
                    .bind(
                        id,
                        placeData.raceType,
                        heldDayData.heldTimes,
                        heldDayData.heldDayTimes,
                    )
                    .run();
            }
        }
    }
}
