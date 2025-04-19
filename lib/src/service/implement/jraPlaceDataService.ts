import { inject, injectable } from 'tsyringe';

import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { BasePlaceDataService } from './basePlaceDataService';

/**
 * Jra開催場データサービス
 */
@injectable()
export class JraPlaceDataService extends BasePlaceDataService<JraPlaceEntity> {
    /**
     *
     * @param placeRepositoryFromStorage
     * @param placeRepositoryFromHtml
     */
    public constructor(
        @inject('JraPlaceRepositoryFromStorage')
        protected placeRepositoryFromStorage: IPlaceRepository<JraPlaceEntity>,
        @inject('JraPlaceRepositoryFromHtml')
        protected placeRepositoryFromHtml: IPlaceRepository<JraPlaceEntity>,
    ) {
        super();
    }
}
