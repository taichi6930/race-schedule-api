import { inject, injectable } from 'tsyringe';

import { CommonParameter } from '../../commonParameter';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { IRaceService } from '../interface/IRaceService';

@injectable()
export class RaceService implements IRaceService {
    public constructor(
        @inject('RaceRepositoryForStorage')
        private readonly repositoryForStorage: IRaceRepository,
        @inject('OverseasRaceRepositoryFromHtml')
        protected overseasRaceRepositoryFromHtml: IRaceRepository,
    ) {}

    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        // return this.repositoryForStorage.fetchRaceEntityList(
        //     commonParameter,
        //     searchRaceFilter,
        // );
        return this.overseasRaceRepositoryFromHtml.fetchRaceEntityList(
            commonParameter,
            searchRaceFilter,
        );
    }
}
