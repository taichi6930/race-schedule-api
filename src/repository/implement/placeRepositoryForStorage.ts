import { formatDate } from 'date-fns';

import { PlaceData } from '../../domain/placeData';
import type { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import type { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

export class PlaceRepositoryForStorage implements IPlaceRepository {
    @Logger
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        const { env } = commonParameter;
        const { raceTypeList, startDate, finishDate } = searchRaceFilter;

        const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
        const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');

        // raceTypeListの数に応じて動的にWHERE句を生成
        const raceTypePlaceholders = raceTypeList.map(() => '?').join(', ');
        const whereClause = `WHERE place.race_type IN (${raceTypePlaceholders}) AND place.date_time >= ? AND place.date_time <= ?`;

        const queryParams: any[] = [];
        queryParams.push(
            ...raceTypeList,
            startDateFormatted,
            finishDateFormatted,
        );
        const { results } = await env.DB.prepare(
            `
            SELECT
                place.id,
                place.race_type,
                place.date_time,
                place.location_name,
                place.created_at,
                place.updated_at
            FROM place
            ${whereClause}`,
        )
            .bind(...queryParams)
            .all();
        return results.map((row: any): PlaceEntity => {
            const dateJST = new Date(new Date(row.date_time));
            return PlaceEntity.create(
                row.id,
                PlaceData.create(row.race_type, dateJST, row.location_name),
                undefined, // TODO: heldDayDataを設定する
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
        for (const entity of entityList) {
            const { id, placeData } = entity;
            // JST変換
            const dateJST = new Date(new Date(placeData.dateTime));
            const dateTimeStr = formatDate(dateJST, 'yyyy-MM-dd HH:mm:ss');
            await insertStmt
                .bind(id, placeData.raceType, dateTimeStr, placeData.location)
                .run();
        }
    }
}
