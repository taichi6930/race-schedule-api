import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import { IPlayerRepository } from '../interface/IPlayerRepository';

// DB登録後の選手エンティティ（必要なら拡張）
export interface PlayerRecord {
    race_type: string;
    player_no: string;
    player_name: string;
    priority: number;
    created_at: string;
    updated_at: string;
}

export class PlayerRepository implements IPlayerRepository {
    public async fetchPlayerDataList(
        commonParameter: CommonParameter,
    ): Promise<PlayerRecord[]> {
        // ...existing code...
        const searchParams =
            commonParameter.searchParams ?? new URLSearchParams();
        const raceType = searchParams.get('race_type');
        let whereClause = '';
        const queryParams: any[] = [];
        const orderBy = searchParams.get('order_by') ?? 'priority';
        const orderDirRaw = searchParams.get('order_dir');
        const orderDir = orderDirRaw ? orderDirRaw : 'ASC';
        const allowedOrderBy = [
            'priority',
            'player_name',
            'race_type',
            'created_at',
        ];
        const validOrderBy = allowedOrderBy.includes(orderBy)
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
        const { results } = await commonParameter.env.DB.prepare(
            `SELECT race_type, player_no, player_name, priority, created_at, updated_at
             FROM player
             ${whereClause}
             ORDER BY ${validOrderBy} ${validOrderDir}, player_no ASC
             LIMIT ?`,
        )
            .bind(...queryParams)
            .all();
        return results as unknown as PlayerRecord[];
    }

    // upsert: 存在すればupdate、なければinsert
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
