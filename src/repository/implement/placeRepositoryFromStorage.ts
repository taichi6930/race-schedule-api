import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import type { IDBGateway } from '../../gateway/interface/iDbGateway';
import type { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
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
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        const { env } = commonParameter;
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
        const { results } = await this.dbGateway.queryAll(
            env,
            `
            ${selectSQL}
            ${fromSQL}
            ${whereClause}
            `,
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
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ): Promise<void> {
        const { env } = commonParameter;
        const insertPlaceSql = `
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
            `;
        // トランザクション開始
        for (const entity of entityList) {
            const { id, placeData, grade } = entity;
            // JST変換
            const dateJST = new Date(new Date(placeData.dateTime));
            const dateTimeStr = formatDate(dateJST, 'yyyy-MM-dd HH:mm:ss');
            await this.dbGateway.run(env, insertPlaceSql, [
                id,
                placeData.raceType,
                dateTimeStr,
                placeData.location,
            ]);
            if (placeData.raceType === RaceType.JRA) {
                const insertHeldDaySql = `
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
                    `;
                const { heldDayData } = entity;
                await this.dbGateway.run(env, insertHeldDaySql, [
                    id,
                    placeData.raceType,
                    heldDayData.heldTimes,
                    heldDayData.heldDayTimes,
                ]);
            }
            if (
                placeData.raceType === RaceType.KEIRIN ||
                placeData.raceType === RaceType.AUTORACE ||
                placeData.raceType === RaceType.BOATRACE
            ) {
                const insertGradeSql = `
                    INSERT INTO place_grade (
                        id,
                        race_type,
                        grade,
                        created_at,
                        updated_at
                    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ON CONFLICT(id) DO UPDATE SET
                        race_type = excluded.race_type,
                        grade = excluded.grade,
                        updated_at = CURRENT_TIMESTAMP
                    `;
                await this.dbGateway.run(env, insertGradeSql, [
                    id,
                    placeData.raceType,
                    grade,
                ]);
            }
        }
    }
}
