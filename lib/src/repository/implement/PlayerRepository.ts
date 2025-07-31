import type { ISQLiteGateway } from '../../gateway/interface/ISQLiteGateway';
import type { IPlayerRepository, Player } from '../interface/IPlayerRepository';

export class PlayerRepository implements IPlayerRepository {
    private readonly gateway: ISQLiteGateway;

    public constructor(gateway: ISQLiteGateway) {
        this.gateway = gateway;
    }

    public upsert = async (player: Player): Promise<void> => {
        const query = `INSERT INTO players (id, race_type, player_no, player_name, priority)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        race_type=excluded.race_type,
        player_no=excluded.player_no,
        player_name=excluded.player_name,
        priority=excluded.priority`;
        await this.gateway.run(query, [
            player.id,
            player.race_type,
            player.player_no,
            player.player_name,
            player.priority,
        ]);
    };

    public findById = async (id: string): Promise<Player | undefined> => {
        const query = 'SELECT * FROM players WHERE id = ?';
        return this.gateway.get<Player>(query, [id]);
    };

    public findAll = async (): Promise<Player[]> => {
        const query = 'SELECT * FROM players';
        return this.gateway.all<Player>(query);
    };

    public deleteById = async (id: string): Promise<void> => {
        const query = 'DELETE FROM players WHERE id = ?';
        await this.gateway.run(query, [id]);
    };
}
