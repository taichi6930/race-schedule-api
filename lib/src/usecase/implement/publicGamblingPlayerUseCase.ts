import { inject, injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { IPlayerDataService } from '../../service/interface/IPlayerDataService';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlayerDataUseCase } from '../interface/IPlayerDataUseCase';

/**
 * 公開用
 */
@injectable()
export class PublicGamblingPlayerUseCase implements IPlayerDataUseCase {
    public constructor(
        @inject('PlayerDataService')
        private readonly playerDataService: IPlayerDataService,
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
