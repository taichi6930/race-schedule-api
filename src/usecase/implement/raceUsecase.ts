import { inject, injectable } from 'tsyringe';

import { CommonParameter } from '../../commonParameter';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import { IRaceService } from '../../service/interface/IRaceService';
import { IRaceUseCase } from '../interface/IRaceUsecase';

@injectable()
export class RaceUseCase implements IRaceUseCase {
    public constructor(
        @inject('RaceService')
        private readonly service: IRaceService,
    ) {}

    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        return this.service.fetchRaceEntityList(
            commonParameter,
            searchRaceFilter,
        );
    }
}
