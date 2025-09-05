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
        const raceType = commonParameter.searchParams.get('race_type');
        let whereClause = '';
        const queryParams: any[] = [];
        const orderBy =
            commonParameter.searchParams.get('order_by') ?? 'priority';
        const orderDir = commonParameter.searchParams.get('order_dir') ?? 'ASC';
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
        queryParams.push(
            Number.parseInt(
                commonParameter.searchParams.get('limit') ?? '10000',
            ),
        );
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
        for (const entity of entityList) {
            // まず存在チェック
            const { results: exist } = await commonParameter.env.DB.prepare(
                `SELECT * FROM player WHERE race_type = ? AND player_no = ?`,
            )
                .bind(entity.raceType, entity.playerNo)
                .all();

            let result;
            if (exist.length > 0) {
                // UPDATE
                result = await commonParameter.env.DB.prepare(
                    `UPDATE player SET player_name = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE race_type = ? AND player_no = ?`,
                )
                    .bind(
                        entity.playerName,
                        entity.priority,
                        entity.raceType,
                        entity.playerNo,
                    )
                    .run();
            } else {
                // INSERT
                result = await commonParameter.env.DB.prepare(
                    `INSERT INTO player (race_type, player_no, player_name, priority, created_at, updated_at)
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                )
                    .bind(
                        entity.raceType,
                        entity.playerNo,
                        entity.playerName,
                        entity.priority,
                    )
                    .run();
            }

            // 登録/更新後のデータを返す
            const { results: after } = await commonParameter.env.DB.prepare(
                `SELECT race_type, player_no, player_name, priority, created_at, updated_at
             FROM player WHERE race_type = ? AND player_no = ?`,
            )
                .bind(entity.raceType, entity.playerNo)
                .all();
        }
    }
}
