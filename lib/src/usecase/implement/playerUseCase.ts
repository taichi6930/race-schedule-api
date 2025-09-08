import { inject, injectable } from 'tsyringe';

import { RaceType } from '../../../../src/utility/raceType';
import { PlayerData } from '../../domain/playerData';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { Logger } from '../../utility/logger';
import { IPlayerDataUseCaseForAWS } from '../interface/IPlayerDataUseCase';

/**
 * 公営競技のプレイヤーデータUseCase
 */
@injectable()
export class PlayerUseCaseForAWS implements IPlayerDataUseCaseForAWS {
    public constructor(
        @inject('PlayerDataService')
        private readonly playerDataService: IPlayerService,
    ) {}

    @Logger
    public async fetchPlayerDataList(
        raceTypeList: RaceType[],
    ): Promise<PlayerData[]> {
        const playerDataList: PlayerData[] =
            await this.playerDataService.fetchPlayerDataList(raceTypeList[0]);
        console.log(
            'PlayerUseCase: fetchPlayerDataList executed',
            playerDataList[0],
        );
        return playerDataList;
    }
}
