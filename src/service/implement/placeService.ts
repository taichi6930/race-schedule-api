import { inject, injectable } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { CommonParameter } from '../../utility/commonParameter';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { UpsertResult } from '../../utility/upsertResult';
import { IPlaceService } from '../interface/IPlaceService';

@injectable()
export class PlaceService implements IPlaceService {
    public constructor(
        @inject('PlaceRepositoryFromStorage')
        private readonly repositoryFromStorage: IPlaceRepository,
        @inject('PlaceRepositoryFromHtml')
        private readonly repositoryFromHtml: IPlaceRepository,
    ) {}

    @Logger
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
        dataLocation: DataLocationType,
    ): Promise<PlaceEntity[]> {
        const repository =
            dataLocation === DataLocation.Storage
                ? this.repositoryFromStorage
                : this.repositoryFromHtml;
        return repository.fetchPlaceEntityList(
            commonParameter,
            searchPlaceFilter,
        );
    }

    @Logger
    public async upsertPlaceEntityList(
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ): Promise<UpsertResult> {
        return this.repositoryFromStorage.upsertPlaceEntityList(
            commonParameter,
            entityList,
        );
    }
}
