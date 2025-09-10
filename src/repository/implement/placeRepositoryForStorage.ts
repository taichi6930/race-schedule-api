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
        const fetchPlaceEntityListForJRA =
            await this.fetchPlaceEntityListForJRA(
                commonParameter,
                searchRaceFilter,
            );
        const fetchPlaceEntityListForNARAndOVERSEAS =
            await this.fetchPlaceEntityListForNARAndOVERSEAS(
                commonParameter,
                searchRaceFilter,
            );
        return [
            ...fetchPlaceEntityListForJRA,
            ...fetchPlaceEntityListForNARAndOVERSEAS,
        ];
    }

    @Logger
    private async fetchPlaceEntityListForJRA(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        const { env } = commonParameter;
        const { raceTypeList, startDate, finishDate } = searchRaceFilter;

        // raceTypeListにNARもしくはOVERSEASが含まれている場合のみに絞る
        const filteredRaceTypeList = raceTypeList.filter(
            (raceType) => raceType === RaceType.JRA,
        );
        if (filteredRaceTypeList.length === 0) {
            return [];
        }

        const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
        const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');

        // raceTypeListの数に応じて動的にWHERE句を生成
        const raceTypePlaceholders = filteredRaceTypeList
            .map(() => '?')
            .join(', ');
        const whereClause = `WHERE place.race_type IN (${raceTypePlaceholders}) AND place.date_time >= ? AND place.date_time <= ?`;

        const queryParams: any[] = [];
        queryParams.push(
            ...filteredRaceTypeList,
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
                held_day.held_times,
                held_day.held_day_times,
                place.created_at,
                place.updated_at
            FROM place
            LEFT JOIN held_day ON place.id = held_day.id
            ${whereClause}`,
        )
            .bind(...queryParams)
            .all();
        return results.map((row: any): PlaceEntity => {
            const dateJST = new Date(new Date(row.date_time));
            return PlaceEntity.create(
                row.id,
                PlaceData.create(row.race_type, dateJST, row.location_name),
                HeldDayData.create(row.held_times, row.held_day_times),
                undefined, // TODO: gradeを設定する
            );
        });
    }

    @Logger
    private async fetchPlaceEntityListForNARAndOVERSEAS(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        const { env } = commonParameter;
        const { raceTypeList, startDate, finishDate } = searchRaceFilter;

        // raceTypeListにNARもしくはOVERSEASが含まれている場合のみに絞る
        const filteredRaceTypeList = raceTypeList.filter(
            (raceType) =>
                raceType === RaceType.NAR || raceType === RaceType.OVERSEAS,
        );
        if (filteredRaceTypeList.length === 0) {
            return [];
        }

        const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
        const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');

        // raceTypeListの数に応じて動的にWHERE句を生成
        const raceTypePlaceholders = filteredRaceTypeList
            .map(() => '?')
            .join(', ');
        const whereClause = `WHERE place.race_type IN (${raceTypePlaceholders}) AND place.date_time >= ? AND place.date_time <= ?`;

        const queryParams: any[] = [];
        queryParams.push(
            ...filteredRaceTypeList,
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
                undefined, // heldDayDataはNARとOVERSEASには存在しないためundefined
                undefined, // gradeはNARとOVERSEASには存在しないためundefined
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
                console.log(heldDayData);
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
