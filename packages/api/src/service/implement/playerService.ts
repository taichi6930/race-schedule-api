import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { inject, injectable } from 'tsyringe';

import type { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../domain/entity/playerEntity';
import type { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import type { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    @Logger
    public async fetchPlayerEntityList(
        searchPlayerFilter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        return this.repository.fetchPlayerEntityList(searchPlayerFilter);
    }

    @Logger
    public async upsertPlayerEntityList(
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.repository.upsertPlayerEntityList(entityList);
    }
}
