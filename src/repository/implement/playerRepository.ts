import type { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { PlayerEntity } from '../entity/playerEntity';
import type { IPlayerRepository } from '../interface/IPlayerRepository';

export class PlayerRepository implements IPlayerRepository {
    @Logger
    public async fetchPlayerEntityList(
        commonParameter: CommonParameter,
        raceType: RaceType,
    ): Promise<PlayerEntity[]> {
        const { env } = commonParameter;
        const queryParams: any[] = [];
        queryParams.push(raceType);
        const { results } = await env.DB.prepare(
            `
            SELECT race_type, player_no, player_name, priority, created_at, updated_at
            FROM player
            WHERE race_type = ?
            ORDER BY player_no ASC
            LIMIT 10000`,
        )
            .bind(...queryParams)
            .all();

        return results.map(
            (row: any): PlayerEntity =>
                PlayerEntity.create(
                    row.race_type,
                    row.player_no,
                    row.player_name,
                    row.priority,
                ),
        );
    }

    @Logger
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
