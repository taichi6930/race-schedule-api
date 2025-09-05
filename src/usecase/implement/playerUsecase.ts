import { inject, injectable } from 'tsyringe';

import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import { CommonParameter } from '../../commonParameter';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { IPlayerUseCase } from '../interface/IPlayerUsecase';

@injectable()
export class PlayerUseCase implements IPlayerUseCase {
    public constructor(
        @inject('PlayerService')
        private readonly service: IPlayerService,
    ) {}

    public async fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]> {
        return this.service.fetchPlayerEntityList(commonParameter);
    }

    public async upsertPlayerEntityList(
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.service.upsertPlayerEntityList(commonParameter, entityList);
    }
}
