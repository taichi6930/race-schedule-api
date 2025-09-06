import { inject, injectable } from 'tsyringe';

import { RaceType } from '../../../lib/src/utility/raceType';
import { CommonParameter } from '../../commonParameter';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { IPlaceUseCase } from '../interface/IPlaceUsecase';

@injectable()
export class PlaceUseCase implements IPlaceUseCase {
    public constructor(
        @inject('PlaceService')
        private readonly service: IPlaceService,
    ) {}

    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        raceType: RaceType,
        startDate: Date,
        endDate: Date,
    ): Promise<PlaceEntity[]> {
        return this.service.fetchPlaceEntityList(
            commonParameter,
            raceType,
            startDate,
            endDate,
        );
    }

    public async upsertPlaceEntityList(
        commonParameter: CommonParameter,
        raceType: RaceType,
        startDate: Date,
        endDate: Date,
    ): Promise<void> {
        const entityList = await this.fetchPlaceEntityList(
            commonParameter,
            raceType,
            startDate,
            endDate,
        );
        console.log(entityList);
        await this.service.upsertPlaceEntityList(commonParameter, entityList);
    }
}
