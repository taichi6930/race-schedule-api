import { inject, injectable } from 'tsyringe';

import {
    DataLocation,
    DataLocationType,
} from '../../../lib/src/utility/dataType';
import { CommonParameter } from '../../commonParameter';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { Logger } from '../../utility/logger';
import { IRaceService } from '../interface/IRaceService';

@injectable()
export class RaceService implements IRaceService {
    public constructor(
        @inject('RaceRepositoryForStorage')
        private readonly repositoryForStorage: IRaceRepository,
        @inject('OverseasRaceRepositoryFromHtml')
        protected overseasRaceRepositoryFromHtml: IRaceRepository,
    ) {}

    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
    ): Promise<RaceEntity[]> {
        const repository =
            dataLocation === DataLocation.Storage
                ? this.repositoryForStorage
                : this.overseasRaceRepositoryFromHtml;
        return repository.fetchRaceEntityList(
            commonParameter,
            searchRaceFilter,
        );
    }

    @Logger
    public async upsertRaceEntityList(
        commonParameter: CommonParameter,
        entityList: RaceEntity[],
    ): Promise<void> {
        await this.repositoryForStorage.upsertRaceEntityList(
            commonParameter,
            entityList,
        );
    }
}
