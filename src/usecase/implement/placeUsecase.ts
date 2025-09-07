import { inject, injectable } from 'tsyringe';

import { DataLocation } from '../../../lib/src/utility/dataType';
import { CommonParameter } from '../../commonParameter';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';
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
        searchPlaceFilterEntity: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        return this.service.fetchPlaceEntityList(
            commonParameter,
            searchPlaceFilterEntity,
            DataLocation.Storage,
        );
    }

    public async upsertPlaceEntityList(
        commonParameter: CommonParameter,
        searchPlaceFilterEntity: SearchPlaceFilterEntity,
    ): Promise<void> {
        const entityList = await this.service.fetchPlaceEntityList(
            commonParameter,
            searchPlaceFilterEntity,
            DataLocation.Web,
        );
        await this.service.upsertPlaceEntityList(commonParameter, entityList);
    }
}
