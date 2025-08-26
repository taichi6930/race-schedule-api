import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { SearchPlayerFilterEntity } from '../../repository/entity/searchPlayerFilterEntity';
import type { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    /**
     * 指定レースタイプのプレイヤーデータを取得
     * @param raceType - レース種別
     */
    @Logger
    public async fetchPlayerDataList(
        raceType: RaceType,
    ): Promise<PlayerData[]> {
        const allPlayers = await this.repository.findAll(
            new SearchPlayerFilterEntity(raceType),
        );
        return allPlayers
            .filter((p) => p.raceType === raceType)
            .map((p) =>
                PlayerData.create(
                    p.raceType,
                    Number.parseInt(p.playerNo),
                    p.playerName,
                    p.priority,
                ),
            );
    }
}
