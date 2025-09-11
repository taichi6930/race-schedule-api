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
        @inject('RaceRepositoryFromStorage')
        private readonly repositoryFromStorage: IRaceRepository,
        @inject('JraRaceRepositoryFromHtml')
        private readonly jraRaceRepositoryFromHtml: IRaceRepository,
        @inject('NarRaceRepositoryFromHtml')
        private readonly narRaceRepositoryFromHtml: IRaceRepository,
        @inject('OverseasRaceRepositoryFromHtml')
        private readonly overseasRaceRepositoryFromHtml: IRaceRepository,
        @inject('KeirinRaceRepositoryFromHtml')
        private readonly keirinRaceRepositoryFromHtml: IRaceRepository,
        @inject('AutoRaceRepositoryFromHtml')
        private readonly autoRaceRepositoryFromHtml: IRaceRepository,
        @inject('BoatRaceRepositoryFromHtml')
        private readonly boatRaceRepositoryFromHtml: IRaceRepository,
    ) {
        this.raceRepositoryFromHtml = {
            [RaceType.JRA]: this.jraRaceRepositoryFromHtml,
            [RaceType.NAR]: this.narRaceRepositoryFromHtml,
            [RaceType.OVERSEAS]: this.overseasRaceRepositoryFromHtml,
            [RaceType.KEIRIN]: this.keirinRaceRepositoryFromHtml,
            [RaceType.AUTORACE]: this.autoRaceRepositoryFromHtml,
            [RaceType.BOATRACE]: this.boatRaceRepositoryFromHtml,
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
                    ? this.repositoryFromStorage
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
        await this.repositoryFromStorage.upsertRaceEntityList(
            commonParameter,
            entityList,
        );
    }
}
