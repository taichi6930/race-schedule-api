import { inject, injectable } from 'tsyringe';

import { SearchPlayerFilterEntity } from '../../repository/entity/filter/searchPlayerFilterEntity';
import { PlayerEntity } from '../../repository/entity/playerEntity';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { Logger } from '../../utility/logger';
import { IPlayerUseCase } from '../interface/IPlayerUsecase';

@injectable()
export class PlayerUseCase implements IPlayerUseCase {
    public constructor(
        @inject('PlayerService')
        private readonly playerService: IPlayerService,
    ) {}

    @Logger
    public async fetchPlayerEntityList(
        searchPlayerFilter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        return this.playerService.fetchPlayerEntityList(searchPlayerFilter);
    }

    @Logger
    public async upsertPlayerEntityList(
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.playerService.upsertPlayerEntityList(entityList);
    }
}
