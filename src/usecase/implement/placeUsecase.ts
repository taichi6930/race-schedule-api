import { inject, injectable } from 'tsyringe';

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
    ): Promise<PlaceEntity[]> {
        return this.service.fetchPlaceEntityList(commonParameter);
    }
}
