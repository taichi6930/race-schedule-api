import { inject, injectable } from 'tsyringe';

import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { BaseRaceDataService } from './baseRaceDataService';

/**
 * Keirinレースデータサービス
 */
@injectable()
export class KeirinRaceDataService extends BaseRaceDataService<
    KeirinRaceEntity,
    KeirinPlaceEntity
> {
    /**
     *
     * @param raceRepositoryFromStorage
     * @param raceRepositoryFromHtml
     */
    public constructor(
        @inject('KeirinRaceRepositoryFromStorage')
        protected readonly raceRepositoryFromStorage: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        protected readonly raceRepositoryFromHtml: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
    ) {
        super();
    }
}
