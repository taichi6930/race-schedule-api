import { inject, injectable } from 'tsyringe';

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
    ) {}

    public async fetchPlaceEntityList(
        commonParameter: CommonParameter,
        raceType: RaceType,
        startDate: Date,
        endDate: Date,
    ): Promise<PlaceEntity[]> {
        return this.repositoryForStorage.fetchPlaceEntityList(
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
