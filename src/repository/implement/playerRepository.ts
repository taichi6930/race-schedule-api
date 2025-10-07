import { inject, injectable } from 'tsyringe';

import type { IDBGateway } from '../../gateway/interface/iDbGateway';
import { EnvStore } from '../../utility/envStore';
import { Logger } from '../../utility/logger';
import { SearchPlayerFilterEntity } from '../entity/filter/searchPlayerFilterEntity';
import { PlayerEntity } from '../entity/playerEntity';
import type { IPlayerRepository } from '../interface/IPlayerRepository';

@injectable()
export class PlayerRepository implements IPlayerRepository {
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}

    @Logger
    public async fetchPlayerEntityList(
        searchPlayerFilter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        const { raceTypeList } = searchPlayerFilter;

        const raceTypePlaceholders = raceTypeList.map(() => '?').join(', ');
        const whereClause = `WHERE race_type IN (${raceTypePlaceholders})`;

        const queryParams: any[] = [];
        queryParams.push(...raceTypeList);
        const { results } = await this.dbGateway.queryAll(
            EnvStore.env,
            `
            SELECT race_type, player_no, player_name, priority, created_at, updated_at
            FROM player
            ${whereClause}
            ORDER BY player_no ASC
            LIMIT 10000`,
            queryParams,
        );

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
        await this.dbGateway.run(EnvStore.env, sql, bindParams);
    }
}
