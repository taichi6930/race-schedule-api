import { PlaceData } from '../../../lib/src/domain/placeData';
import type { CommonParameter } from '../../commonParameter';
import { PlaceEntity } from '../entity/placeEntity';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

export class PlaceRepository implements IPlaceRepository {
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlaceEntity[]> {
        const { searchParams, env } = commonParameter;
        const raceType = searchParams.get('race_type');
        let whereClause = '';
        const queryParams: any[] = [];
        const orderBy = searchParams.get('order_by') ?? 'priority';
        const orderDir = searchParams.get('order_dir') ?? 'ASC';
        const validOrderBy = ['priority', 'race_type', 'created_at'].includes(
            orderBy,
        )
            ? orderBy
            : 'priority';
        const validOrderDir = ['ASC', 'DESC'].includes(orderDir.toUpperCase())
            ? orderDir.toUpperCase()
            : 'ASC';
        if (raceType) {
            whereClause = 'WHERE race_type = ?';
            queryParams.push(raceType);
        }
        queryParams.push(Number.parseInt(searchParams.get('limit') ?? '10000'));
        const { results } = await env.DB.prepare(
            `
            SELECT id, race_type, date_time, location_name, created_at, updated_at
            FROM place
            ${whereClause}
            ORDER BY ${validOrderBy} ${validOrderDir}, place_no ASC
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
