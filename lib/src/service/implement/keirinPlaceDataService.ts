import { inject, injectable } from 'tsyringe';

import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { BasePlaceDataService } from './basePlaceDataService';

/**
 * Keirin開催場データサービス
 */
@injectable()
export class KeirinPlaceDataService extends BasePlaceDataService<KeirinPlaceEntity> {
    constructor(
        @inject('KeirinPlaceRepositoryFromStorage')
        protected placeRepositoryFromStorage: IPlaceRepository<KeirinPlaceEntity>,
        @inject('KeirinPlaceRepositoryFromHtml')
        protected placeRepositoryFromHtml: IPlaceRepository<KeirinPlaceEntity>,
    ) {
        super();
    }
}
