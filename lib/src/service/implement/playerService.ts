import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import type { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { Logger } from '../../utility/logger';
import { isRaceType, RaceType } from '../../utility/raceType';
import type { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    /**
     * 指定レースタイプのプレイヤーデータを取得
     * @param _type - レースタイプ
     */
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
                // race_typeの型安全な変換
                const raceTypeStr = p.race_type.toUpperCase();
                if (!isRaceType(raceTypeStr)) {
                    throw new Error(`Invalid race_type: ${p.race_type}`);
                }

                // RaceType値を取得
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
