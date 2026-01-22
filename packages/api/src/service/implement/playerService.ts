import { inject, injectable } from 'tsyringe';

import { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import { PlayerEntity } from '../../domain/entity/playerEntity';
import { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    public async fetchPlayerEntityList(
        searchPlayerFilter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        return this.repository.fetchPlayerEntityList(searchPlayerFilter);
    }

    public async upsertPlayerEntityList(
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.repository.upsertPlayerEntityList(entityList);
    }
}
