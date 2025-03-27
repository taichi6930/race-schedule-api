import { inject, injectable } from 'tsyringe';

import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { BasePlaceDataService } from './basePlaceDataService';

/**
 * Boatrace開催場データサービス
 */
@injectable()
export class BoatracePlaceDataService extends BasePlaceDataService<BoatracePlaceEntity> {
    public constructor(
        @inject('BoatracePlaceRepositoryFromStorage')
        protected placeRepositoryFromStorage: IPlaceRepository<BoatracePlaceEntity>,
        @inject('BoatracePlaceRepositoryFromHtml')
        protected placeRepositoryFromHtml: IPlaceRepository<BoatracePlaceEntity>,
    ) {
        super();
    }
}
