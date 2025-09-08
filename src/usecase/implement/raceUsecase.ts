import { inject, injectable } from 'tsyringe';

import { DataLocation } from '../../../lib/src/utility/dataType';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import { IRaceService } from '../../service/interface/IRaceService';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { IRaceUseCase } from '../interface/IRaceUsecase';

@injectable()
export class RaceUseCase implements IRaceUseCase {
    public constructor(
        @inject('RaceService')
        private readonly service: IRaceService,
    ) {}

    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        return this.service.fetchRaceEntityList(
            commonParameter,
            searchRaceFilter,
            DataLocation.Storage,
        );
    }

    @Logger
    public async upsertRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<void> {
        const entityList: RaceEntity[] = await this.service.fetchRaceEntityList(
            commonParameter,
            searchRaceFilter,
            DataLocation.Web,
        );
        return this.service.upsertRaceEntityList(commonParameter, entityList);
    }
}
