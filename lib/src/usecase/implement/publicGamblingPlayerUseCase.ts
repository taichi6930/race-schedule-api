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
    public fetchPlayerDataList(raceTypeList: string[]): PlayerData[] {
        // 開催場データを取得

        const [raceType] = raceTypeList;
        if (!isRaceType(raceType)) {
            throw new Error(`Invalid race type: ${raceType}`);
        }
        const playerDataList: PlayerData[] =
            this.playerDataService.fetchPlayerDataList(raceType);
        console.log(playerDataList);
        return playerDataList;
    }
}
