import { inject, injectable } from 'tsyringe';

import { SearchPlayerFilterEntity } from '../../repository/entity/filter/searchPlayerFilterEntity';
import { PlayerEntity } from '../../repository/entity/playerEntity';
import { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { Logger } from '../../utility/logger';
import { IPlayerService } from '../interface/IPlayerService';

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
