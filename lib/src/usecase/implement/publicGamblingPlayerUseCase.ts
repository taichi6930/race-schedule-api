import { inject, injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { IPlayerDataService } from '../../service/interface/IPlayerDataService';
import { Logger } from '../../utility/logger';
import { isRaceType } from '../../utility/raceType';
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
        raceTypeList: string[],
    ): Promise<PlayerData[]> {
        const [raceType] = raceTypeList;
        if (!isRaceType(raceType)) {
            throw new Error(`Invalid race type: ${raceType}`);
        }
        const playerDataList: PlayerData[] =
            await this.playerDataService.fetchPlayerDataList(raceType);
        console.log(
            'PublicGamblingPlayerUseCase: fetchPlayerDataList executed',
            playerDataList[0],
        );
        return playerDataList;
    }
}
