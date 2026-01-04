import { inject, injectable } from 'tsyringe';

import type { IDBGateway } from '../../gateway/interface/iDbGateway';
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

        const queryParams: any[] = [...raceTypeList];
        const { results } = await this.dbGateway.queryAll(
            `
            SELECT race_type, player_no, player_name, priority, created_at, updated_at
            FROM player
            ${whereClause}
            ORDER BY player_no ASC
            LIMIT 10000`,
            queryParams,
        );

        // results is provided by the DB gateway and is untyped (any[]).
        // Allow a controlled usage here with explicit conversions.

        const rows: any[] = results;

        // The DB gateway returns untyped results; explicit conversions are used
        // before constructing entities. Disable unsafe-return for this line.

        return rows.map(
            (row: any): PlayerEntity =>
                PlayerEntity.create(
                    String(row.race_type),
                    String(row.player_no),
                    String(row.player_name),
                    Number(row.priority),
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
        await this.dbGateway.run(sql, bindParams);
    }
}
