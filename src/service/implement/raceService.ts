import { inject, injectable } from 'tsyringe';

import {
    DataLocation,
    DataLocationType,
} from '../../../lib/src/utility/dataType';
import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IRaceService } from '../interface/IRaceService';

@injectable()
export class RaceService implements IRaceService {
    private readonly raceRepositoryFromHtml: Record<RaceType, IRaceRepository>;

    public constructor(
        @inject('RaceRepositoryForStorage')
        private readonly repositoryForStorage: IRaceRepository,
        @inject('NarRaceRepositoryFromHtml')
        private readonly narRaceRepositoryFromHtml: IRaceRepository,
        @inject('OverseasRaceRepositoryFromHtml')
        private readonly overseasRaceRepositoryFromHtml: IRaceRepository,
    ) {
        this.raceRepositoryFromHtml = {
            [RaceType.JRA]: this.narRaceRepositoryFromHtml,
            [RaceType.NAR]: this.narRaceRepositoryFromHtml,
            [RaceType.OVERSEAS]: this.overseasRaceRepositoryFromHtml,
            [RaceType.KEIRIN]: this.narRaceRepositoryFromHtml,
            [RaceType.AUTORACE]: this.narRaceRepositoryFromHtml,
            [RaceType.BOATRACE]: this.narRaceRepositoryFromHtml,
        };
    }

    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];
        for (const raceType of searchRaceFilter.raceTypeList) {
            const repository =
                dataLocation === DataLocation.Storage
                    ? this.repositoryForStorage
                    : this.raceRepositoryFromHtml[raceType];
            const fetchedRaceEntityList = await repository.fetchRaceEntityList(
                commonParameter,
                searchRaceFilter,
                placeEntityList,
            );
            raceEntityList.push(...fetchedRaceEntityList);
        }
        return raceEntityList;
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
