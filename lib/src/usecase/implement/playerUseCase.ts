import { inject, injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlayerDataUseCase } from '../interface/IPlayerDataUseCase';

/**
 * 公営競技のプレイヤーデータUseCase
 */
@injectable()
export class PlayerUseCase implements IPlayerDataUseCase {
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
            'PublicGamblingPlayerUseCase: fetchPlayerDataList executed',
            playerDataList[0],
        );
        return playerDataList;
    }
}
