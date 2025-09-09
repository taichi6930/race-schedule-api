import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { RaceType } from '../../../../src/utility/raceType';
import { PlayerData } from '../../domain/playerData';
import { SearchPlayerFilterEntityForAWS } from '../../repository/entity/searchPlayerFilterEntity';
import type { IPlayerRepositoryForAWS } from '../../repository/interface/IPlayerRepository';
import { Logger } from '../../utility/logger';
import type { IPlayerServiceForAWS } from '../interface/IPlayerService';

@injectable()
export class PlayerServiceForAWS implements IPlayerServiceForAWS {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepositoryForAWS,
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
            new SearchPlayerFilterEntityForAWS(raceType),
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
