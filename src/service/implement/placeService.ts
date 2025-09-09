import { inject, injectable } from 'tsyringe';

import { DataLocationType } from '../../../lib/src/utility/dataType';
import { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { IPlaceService } from '../interface/IPlaceService';

@injectable()
export class PlaceService implements IPlaceService {
    public constructor(
        @inject('PlaceRepositoryForStorage')
        private readonly repositoryForStorage: IPlaceRepository,
        // @inject('PlaceRepositoryFromHtml')
        // private readonly repositoryFromHtml: IPlaceRepository,
    ) {}

    @Logger
    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        searchPlaceFilter: SearchPlaceFilterEntity,
        dataLocation: DataLocationType,
    ): Promise<PlaceEntity[]> {
        // const repository =
        //     dataLocation === DataLocation.Storage
        //         ? this.repositoryForStorage
        //         : this.repositoryFromHtml;
        console.log(dataLocation);
        const repository = this.repositoryForStorage;
        return repository.fetchPlaceEntityList(
            commonParameter,
            searchPlaceFilter,
        );
    }

    @Logger
    public async upsertPlaceEntityList(
        commonParameter: CommonParameter,
        entityList: PlaceEntity[],
    ): Promise<void> {
        await this.repositoryForStorage.upsertPlaceEntityList(
            commonParameter,
            entityList,
        );
    }
}
