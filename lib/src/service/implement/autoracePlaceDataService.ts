import { inject, injectable } from 'tsyringe';

import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { BasePlaceDataService } from './basePlaceDataService';

/**
 * Autorace開催場データサービス
 */
@injectable()
export class AutoracePlaceDataService extends BasePlaceDataService<AutoracePlaceEntity> {
    public constructor(
        @inject('AutoracePlaceRepositoryFromStorage')
        protected placeRepositoryFromStorage: IPlaceRepository<AutoracePlaceEntity>,
        @inject('AutoracePlaceRepositoryFromHtml')
        protected placeRepositoryFromHtml: IPlaceRepository<AutoracePlaceEntity>,
    ) {
        super();
    }
}
