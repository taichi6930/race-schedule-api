import { inject, injectable } from 'tsyringe';

import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { BasePlaceDataService } from './basePlaceDataService';

/**
 * Nar開催場データサービス
 */
@injectable()
export class NarPlaceDataService extends BasePlaceDataService<NarPlaceEntity> {
    constructor(
        @inject('NarPlaceRepositoryFromStorage')
        protected placeRepositoryFromStorage: IPlaceRepository<NarPlaceEntity>,
        @inject('NarPlaceRepositoryFromHtml')
        protected placeRepositoryFromHtml: IPlaceRepository<NarPlaceEntity>,
    ) {
        super();
    }
}
