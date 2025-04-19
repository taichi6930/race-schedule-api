import { inject, injectable } from 'tsyringe';

import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { BaseRaceDataService } from './baseRaceDataService';

/**
 * Narレースデータサービス
 */
@injectable()
export class NarRaceDataService extends BaseRaceDataService<
    NarRaceEntity,
    NarPlaceEntity
> {
    /**
     *
     * @param raceRepositoryFromStorage
     * @param raceRepositoryFromHtml
     */
    public constructor(
        @inject('NarRaceRepositoryFromStorage')
        protected readonly raceRepositoryFromStorage: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >,
        @inject('NarRaceRepositoryFromHtml')
        protected readonly raceRepositoryFromHtml: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >,
    ) {
        super();
    }
}
