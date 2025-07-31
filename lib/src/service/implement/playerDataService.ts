import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import type { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import type { RaceType } from '../../utility/raceType';
import type { IPlayerDataService } from '../interface/IPlayerDataService';

@injectable()
export class PlayerDataService implements IPlayerDataService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    /**
     * プレイヤーデータをDBから取得します
     * @param type
     */
    public fetchPlayerDataList(type: RaceType): PlayerData[] {
        const allPlayers = this.repository.findAll();
        return allPlayers
            .filter((p) => p.race_type === (type as string))
            .map((p) =>
                PlayerData.create(
                    type,
                    Number.parseInt(p.player_no),
                    p.player_name,
                    p.priority,
                ),
            );
    }
}
