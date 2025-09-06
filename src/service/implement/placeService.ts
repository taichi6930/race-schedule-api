import { inject, injectable } from 'tsyringe';

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
    ): Promise<PlaceEntity[]> {
        return this.repositoryForStorage.fetchPlaceEntityList(commonParameter);
    }
}
