import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import type { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { isRaceType } from '../../utility/raceType';
import type { IPlayerDataService } from '../interface/IPlayerDataService';

@injectable()
export class PlayerDataService implements IPlayerDataService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    
    @Logger
    public async fetchPlayerDataList(_type: RaceType): Promise<PlayerData[]> {
        const allPlayers = await this.repository.findAll();
        return allPlayers
            .filter((p) => {
                const raceTypeStr = p.race_type.toUpperCase();
                if (!isRaceType(raceTypeStr)) {
                    return false;
                }
                return p.race_type.toUpperCase() === _type.toUpperCase();
            })
            .map((p) => {
                
                const raceTypeStr = p.race_type.toUpperCase();
                if (!isRaceType(raceTypeStr)) {
                    throw new Error(`Invalid race_type: ${p.race_type}`);
                }

                
                const raceTypeEnum =
                    RaceType[raceTypeStr as keyof typeof RaceType];
                return PlayerData.create(
                    raceTypeEnum,
                    Number.parseInt(p.player_no),
                    p.player_name,
                    p.priority,
                );
            });
    }
}
