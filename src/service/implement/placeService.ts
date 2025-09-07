import { inject, injectable } from 'tsyringe';

import {
    DataLocation,
    DataLocationType,
} from '../../../lib/src/utility/dataType';
import { RaceType } from '../../../lib/src/utility/raceType';
import { CommonParameter } from '../../commonParameter';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IPlaceService } from '../interface/IPlaceService';

@injectable()
export class PlaceService implements IPlaceService {
    public constructor(
        @inject('PlaceRepositoryForStorage')
        private readonly repositoryForStorage: IPlaceRepository,
        @inject('PlaceRepositoryForHtml')
        private readonly repositoryForHtml: IPlaceRepository,
    ) {}

    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        raceType: RaceType,
        startDate: Date,
        endDate: Date,
        dataLocationType: DataLocationType,
    ): Promise<PlaceEntity[]> {
        const repository =
            dataLocationType === DataLocation.Web
                ? this.repositoryForHtml
                : this.repositoryForStorage;
        return repository.fetchPlaceEntityList(
            commonParameter,
            raceType,
            startDate,
            endDate,
        );
    }

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
