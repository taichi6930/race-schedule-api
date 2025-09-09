import { inject, injectable } from 'tsyringe';

import { DataLocation } from '../../../lib/src/utility/dataType';
import { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { IPlaceUseCase } from '../interface/IPlaceUsecase';

@injectable()
export class PlaceUseCase implements IPlaceUseCase {
    public constructor(
        @inject('PlaceService')
        private readonly service: IPlaceService,
    ) {}

    @Logger
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        return this.service.fetchPlaceEntityList(
            commonParameter,
            searchPlaceFilter,
            DataLocation.Storage,
        );
    }

    @Logger
    public async upsertPlaceEntityList(
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ): Promise<void> {
        const entityList: PlaceEntity[] =
            await this.service.fetchPlaceEntityList(
                commonParameter,
                searchPlaceFilter,
                DataLocation.Web,
            );
        return this.service.upsertPlaceEntityList(commonParameter, entityList);
    }
}
