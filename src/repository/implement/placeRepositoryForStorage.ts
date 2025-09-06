import { PlaceData } from '../../../lib/src/domain/placeData';
import type { CommonParameter } from '../../commonParameter';
import { PlaceEntity } from '../entity/placeEntity';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

export class PlaceRepositoryForStorage implements IPlaceRepository {
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlaceEntity[]> {
        const { searchParams, env } = commonParameter;
        const raceType = searchParams.get('race_type');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        const whereParts: string[] = [];
        const queryParams: any[] = [];
        const orderBy = searchParams.get('order_by') ?? 'race_type';
        const orderDir = searchParams.get('order_dir') ?? 'ASC';
        const validOrderBy = ['race_type', 'created_at'].includes(orderBy)
            ? orderBy
            : 'race_type';
        const validOrderDir = ['ASC', 'DESC'].includes(orderDir.toUpperCase())
            ? orderDir.toUpperCase()
            : 'ASC';
        if (raceType) {
            whereParts.push('race_type = ?');
            queryParams.push(raceType);
        }
        if (startDate) {
            whereParts.push('date_time >= ?');
            queryParams.push(startDate);
        }
        if (endDate) {
            whereParts.push('date_time <= ?');
            queryParams.push(endDate);
        }
        const whereClause =
            whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';
        queryParams.push(Number.parseInt(searchParams.get('limit') ?? '10000'));
        const { results } = await env.DB.prepare(
            `
            SELECT id, race_type, date_time, location_name, created_at, updated_at
            FROM place
            ${whereClause}
            ORDER BY ${validOrderBy} ${validOrderDir}
            LIMIT ?`,
        )
            .bind(...queryParams)
            .all();
        return results.map(
            (row: any): PlaceEntity =>
                PlaceEntity.create(
                    row.id,
                    PlaceData.create(
                        row.race_type,
                        row.date_time,
                        row.location_name,
                    ),
                ),
        );
    }
}
