import { inject, injectable } from 'tsyringe';

import { PlayerEntity } from '../../repository/entity/playerEntity';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlayerUseCase } from '../interface/IPlayerUsecase';

@injectable()
export class PlayerUseCase implements IPlayerUseCase {
    public constructor(
        @inject('PlayerService')
        private readonly service: IPlayerService,
    ) {}

    @Logger
    public async fetchPlayerEntityList(
        commonParameter: CommonParameter,
        raceType: RaceType,
    ): Promise<PlayerEntity[]> {
        return this.service.fetchPlayerEntityList(commonParameter, raceType);
    }

    @Logger
    public async upsertPlayerEntityList(
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.service.upsertPlayerEntityList(commonParameter, entityList);
    }
}
