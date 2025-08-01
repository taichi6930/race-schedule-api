import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import type { ISQLiteGateway } from '../../gateway/interface/ISQLiteGateway';
import { Logger } from '../../utility/logger';
import type { IPlayerRepository, Player } from '../interface/IPlayerRepository';

@injectable()
export class PlayerRepository implements IPlayerRepository {
    public constructor(
        @inject('SQLiteGateway')
        private readonly gateway: ISQLiteGateway,
    ) {}

    @Logger
    public upsert(player: Player): void {
        const query = `INSERT INTO players (id, race_type, player_no, player_name, priority)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        race_type=excluded.race_type,
        player_no=excluded.player_no,
        player_name=excluded.player_name,
        priority=excluded.priority`;
        this.gateway.run(query, [
            player.id,
            player.race_type,
            player.player_no,
            player.player_name,
            player.priority,
        ]);
    }

    @Logger
    public findById(id: string): Player | undefined {
        const query = 'SELECT * FROM players WHERE id = ?';
        return this.gateway.get<Player>(query, [id]);
    }

    @Logger
    public findAll(): Player[] {
        const query = 'SELECT * FROM players';
        const result = this.gateway.all<Player>(query);
        console.log('PlayerRepository: findAll executed', {
            query,
            result,
        });
        return Array.isArray(result) ? result : [];
    }

    @Logger
    public deleteById(id: string): void {
        const query = 'DELETE FROM players WHERE id = ?';
        this.gateway.run(query, [id]);
    }
}
