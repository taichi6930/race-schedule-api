import { inject, injectable } from 'tsyringe';

import { PlayerEntity } from '../../repository/entity/playerEntity';
import { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlayerService } from '../interface/IPlayerService';

@injectable()
export class PlayerService implements IPlayerService {
    public constructor(
        @inject('PlayerRepository')
        private readonly repository: IPlayerRepository,
    ) {}

    @Logger
    public async fetchPlayerEntityList(
        commonParameter: CommonParameter,
        raceType: RaceType,
    ): Promise<PlayerEntity[]> {
        return this.repository.fetchPlayerEntityList(commonParameter, raceType);
    }

    @Logger
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
