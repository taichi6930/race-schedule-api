import { HorseRaceConditionData } from '../../../lib/src/domain/houseRaceConditionData';
import { RaceData } from '../../../lib/src/domain/raceData';
import type { CommonParameter } from '../../commonParameter';
import { RaceEntity } from '../entity/raceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

export class RaceRepository implements IRaceRepository {
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        const { env } = commonParameter;
        const { raceType, startDate, finishDate } = searchRaceFilter;

        const whereClause =
            'WHERE race_type = ? AND date_time >= ? AND date_time <= ?';
        const queryParams: any[] = [];
        queryParams.push(raceType, startDate, finishDate);
        const { results } = await env.DB.prepare(
            `
            SELECT
                race.id,
                race.race_type,
                race.name,
                race.date_time,
                race.location_name,
                race.surface_type,
                race.distance,
                race.grade,
                race.race_number,
                race.created_at,
                race.updated_at
            FROM race
            ${whereClause}`,
        )
            .bind(...queryParams)
            .all();
        return results.map(
            (row: any): RaceEntity =>
                RaceEntity.create(
                    row.id,
                    RaceData.create(
                        row.race_type,
                        row.name,
                        row.date_time,
                        row.location_name,
                        row.grade,
                        row.race_number,
                    ),
                    HorseRaceConditionData.create(
                        row.surface_type,
                        row.distance,
                    ),
                ),
        );
    }
}
