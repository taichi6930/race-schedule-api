import { formatDate } from 'date-fns';

import { HorseRaceConditionData } from '../../../lib/src/domain/houseRaceConditionData';
import { RaceData } from '../../../lib/src/domain/raceData';
import type { CommonParameter } from '../../commonParameter';
import { Logger } from '../../utility/logger';
import { RaceEntity } from '../entity/raceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

export class RaceRepositoryForStorage implements IRaceRepository {
    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        const { env } = commonParameter;
        const { raceType, startDate, finishDate } = searchRaceFilter;

        const startDateFormatted = formatDate(startDate, 'yyyy-MM-dd');
        const finishDateFormatted = formatDate(finishDate, 'yyyy-MM-dd');

        const whereClause =
            'WHERE race.race_type = ? AND race.date_time >= ? AND race.date_time <= ?';
        const queryParams: any[] = [];
        queryParams.push(raceType, startDateFormatted, finishDateFormatted);
        const { results } = await env.DB.prepare(
            `
            SELECT
                race.id,
                race.race_type,
                race.race_name,
                race.date_time,
                race.location_name,
                race_condition.surface_type,
                race_condition.distance,
                race.grade,
                race.race_number,
                race.created_at,
                race.updated_at
            FROM race
            INNER JOIN race_condition ON race.id = race_condition.id
            ${whereClause}`,
        )
            .bind(...queryParams)
            .all();
        return results.map((row: any): RaceEntity => {
            const dateJST = new Date(
                new Date(row.date_time).getTime() + 9 * 60 * 60 * 1000,
            );
            return RaceEntity.create(
                row.id,
                RaceData.create(
                    row.race_type,
                    row.race_name,
                    dateJST,
                    row.location_name,
                    row.grade,
                    row.race_number,
                ),
                HorseRaceConditionData.create(row.surface_type, row.distance),
            );
        });
    }
}
