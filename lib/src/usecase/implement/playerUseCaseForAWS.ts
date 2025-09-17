import { inject, injectable } from 'tsyringe';

import { RaceType } from '../../../../src/utility/raceType';
import { PlayerDataForAWS } from '../../domain/playerData';
import { IPlayerServiceForAWS } from '../../service/interface/IPlayerServiceForAWS';
import { Logger } from '../../utility/logger';
import { IPlayerDataUseCaseForAWS } from '../interface/IPlayerDataUseCaseForAWS';

/**
 * 公営競技のプレイヤーデータUseCase
 */
@injectable()
export class PlayerUseCaseForAWS implements IPlayerDataUseCaseForAWS {
    public constructor(
        @inject('PlayerDataService')
        private readonly playerDataService: IPlayerServiceForAWS,
    ) {}

    @Logger
    public async fetchPlayerDataList(
        raceTypeList: RaceType[],
    ): Promise<PlayerDataForAWS[]> {
        const playerDataList: PlayerDataForAWS[] =
            await this.playerDataService.fetchPlayerDataList(raceTypeList[0]);
        return playerDataList;
    }
}
