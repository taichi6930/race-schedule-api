import type { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import type { CommonParameter } from '../../commonParameter';
import type { IPlayerRepository } from '../interface/IPlayerRepository';
import { PlayerRecord } from '../record/playerRecord';

export class PlayerRepository implements IPlayerRepository {
    public async fetchPlayerDataList(
        commonParameter: CommonParameter,
    ): Promise<PlayerRecord[]> {
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
            `SELECT race_type, player_no, player_name, priority, created_at, updated_at
             FROM player
             ${whereClause}
             ORDER BY ${validOrderBy} ${validOrderDir}, player_no ASC
             LIMIT ?`,
        )
            .bind(...queryParams)
            .all();

        return results.map(
            (row: any): PlayerRecord =>
                PlayerRecord.create(
                    row.race_type,
                    row.player_no,
                    row.player_name,
                    row.priority,
                    row.created_at,
                    row.updated_at,
                ),
        );
    }

    public async upsertPlayerEntityList(
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ): Promise<void> {
        if (entityList.length === 0) return;
        // SQL生成
        const valuesSql = entityList
            .map(() => '(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)')
            .join(', ');
        const sql = `INSERT INTO player (race_type, player_no, player_name, priority, created_at, updated_at)
            VALUES ${valuesSql}
            ON CONFLICT(race_type, player_no) DO UPDATE SET
                player_name=excluded.player_name,
                priority=excluded.priority,
                updated_at=CURRENT_TIMESTAMP;`;
        // bindパラメータ
        const bindParams = entityList.flatMap((e) => [
            e.raceType,
            e.playerNo,
            e.playerName,
            e.priority,
        ]);
        await commonParameter.env.DB.prepare(sql)
            .bind(...bindParams)
            .run();
    }
}
