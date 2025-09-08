import { inject, injectable } from 'tsyringe';

import { CommonParameter } from '../../commonParameter';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { IRaceService } from '../interface/IRaceService';

@injectable()
export class RaceService implements IRaceService {
    public constructor(
        @inject('RaceRepositoryForStorage')
        private readonly repositoryForStorage: IRaceRepository,
    ) {}

    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
    ): Promise<RaceEntity[]> {
        return this.repositoryForStorage.fetchRaceEntityList(commonParameter);
    }
}
