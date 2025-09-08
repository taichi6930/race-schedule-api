import { inject, injectable } from 'tsyringe';

import { PlayerEntity } from '../../repository/entity/playerEntity';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
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
    ): Promise<PlayerEntity[]> {
        return this.service.fetchPlayerEntityList(commonParameter);
    }

    @Logger
    public async upsertPlayerEntityList(
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.service.upsertPlayerEntityList(commonParameter, entityList);
    }
}
