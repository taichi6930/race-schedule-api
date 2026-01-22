import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { inject, injectable } from 'tsyringe';

import type { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../domain/entity/playerEntity';
import type { IPlayerService } from '../../service/interface/IPlayerService';
import type { IPlayerUseCase } from '../interface/IPlayerUsecase';

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
