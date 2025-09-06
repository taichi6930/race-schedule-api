import { PlaceData } from '../../../lib/src/domain/placeData';
import type { RaceType } from '../../../lib/src/utility/raceType';
import type { CommonParameter } from '../../commonParameter';
import { parseDbStringJst, toDbStringJst } from '../../util/datetime';
import { PlaceEntity } from '../entity/placeEntity';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

export class PlaceRepositoryForStorage implements IPlaceRepository {
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        raceType: RaceType,
        startDate: Date,
        endDate: Date,
    ): Promise<PlaceEntity[]> {
        const { searchParams, env } = commonParameter;
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
        whereParts.push('race_type = ?');
        queryParams.push(raceType);
        whereParts.push('date_time >= ?', 'date_time <= ?');

        queryParams.push(toDbStringJst(startDate), toDbStringJst(endDate));
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
                        // DB上の date_time は 'YYYY-MM-DD HH:mm:ss' (JST) で保存されている想定
                        parseDbStringJst(row.date_time),
                        row.location_name,
                    ),
                ),
        );
    }

    public async upsertPlaceEntityList(
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ): Promise<void> {
        if (entityList.length === 0) return;
        const { env } = commonParameter;
        // SQL生成
        const valuesSql = entityList
            .map(() => '(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)')
            .join(', ');
        const sql = `INSERT INTO place (id, race_type, date_time, location_name, created_at, updated_at) VALUES
            ${valuesSql}
            ON CONFLICT(id) DO UPDATE SET
                race_type = excluded.race_type,
                date_time = excluded.date_time,
                location_name = excluded.location_name,
                updated_at = CURRENT_TIMESTAMP;
        `;
        // bindパラメータ（JST 前提で DB 形式に変換）
        const bindParams = entityList.flatMap((e) => [
            e.id,
            e.placeData.raceType,
            toDbStringJst(e.placeData.dateTime),
            e.placeData.location,
        ]);
        await env.DB.prepare(sql)
            .bind(...bindParams)
            .run();
    }
}
