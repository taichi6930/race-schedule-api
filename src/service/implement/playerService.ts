import { inject, injectable } from 'tsyringe';

import { CommonParameter } from '../../commonParameter';
import { PlayerEntity } from '../../repository/entity/playerEntity';
import { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    public async fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]> {
        return this.repository.fetchPlayerDataList(commonParameter);
    }

    public async upsertPlayerEntityList(
        commonParameter: CommonParameter,
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.repository.upsertPlayerEntityList(
            commonParameter,
            entityList,
        );
    }
}
