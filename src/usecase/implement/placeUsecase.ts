import { inject, injectable } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import type { PlaceEntityTagged } from '../../repository/entity/placeEntities';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { CommonParameter } from '../../utility/commonParameter';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceUseCase } from '../interface/IPlaceUsecase';

@injectable()
export class PlaceUseCase implements IPlaceUseCase {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IPlaceService,
    ) {}

    @Logger
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        return this.placeService.fetchPlaceEntityList(
            commonParameter,
            searchPlaceFilter,
            DataLocation.Storage,
        );
    }

    @Logger
    public async fetchPlaceEntityListV2(
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntityTagged[]> {
        return this.placeService.fetchPlaceEntityListV2(
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
            await this.placeService.fetchPlaceEntityList(
                commonParameter,
                searchPlaceFilter,
                DataLocation.Web,
            );
        return this.placeService.upsertPlaceEntityList(
            commonParameter,
            entityList,
        );
    }
}
