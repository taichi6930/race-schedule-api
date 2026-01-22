import type { RaceType } from '@race-schedule/shared/src/types/raceType';
import { inject, injectable } from 'tsyringe';

import { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import { PlayerEntity } from '../../domain/entity/playerEntity';
import { IDBGateway } from '../../gateway/interface/IDBGateway';
import type { IPlayerRepository } from '../interface/IPlayerRepository';

@injectable()
export class PlayerRepository implements IPlayerRepository {
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}

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

        return results.map((row: any): PlayerEntity => {
            return PlayerEntity.create(
                String(row.race_type) as RaceType,
                String(row.player_no),
                String(row.player_name),
                Number(row.priority),
            );
        });
    }

    public async upsertPlayerEntityList(
        entityList: PlayerEntity[],
    ): Promise<void> {
        if (entityList.length === 0) return;
        const valuesSql = entityList
            .map(() => '(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)')
            .join(', ');
        const sql = `INSERT INTO player (race_type, player_no, player_name, priority, created_at, updated_at)
            VALUES ${valuesSql}
            ON CONFLICT(race_type, player_no) DO UPDATE SET
                player_name=excluded.player_name,
                priority=excluded.priority,
                updated_at=CURRENT_TIMESTAMP;`;
        const bindParams = entityList.flatMap((e) => [
            e.raceType,
            e.playerNo,
            e.playerName,
            e.priority,
        ]);
        await this.dbGateway.run(sql, bindParams);
    }
}
