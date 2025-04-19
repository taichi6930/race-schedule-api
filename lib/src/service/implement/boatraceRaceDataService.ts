import { inject, injectable } from 'tsyringe';

import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { BaseRaceDataService } from './baseRaceDataService';

/**
 * Boatraceレースデータサービス
 */
@injectable()
export class BoatraceRaceDataService extends BaseRaceDataService<
    BoatraceRaceEntity,
    BoatracePlaceEntity
> {
    /**
     *
     * @param raceRepositoryFromStorage
     * @param raceRepositoryFromHtml
     */
    public constructor(
        @inject('BoatraceRaceRepositoryFromStorage')
        protected readonly raceRepositoryFromStorage: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromHtml')
        protected readonly raceRepositoryFromHtml: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >,
    ) {
        super();
    }
}
