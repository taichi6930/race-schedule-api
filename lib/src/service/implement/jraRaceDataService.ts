import { inject, injectable } from 'tsyringe';

import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { BaseRaceDataService } from './baseRaceDataService';

/**
 * Jraレースデータサービス
 */
@injectable()
export class JraRaceDataService extends BaseRaceDataService<
    JraRaceEntity,
    JraPlaceEntity
> {
    public constructor(
        @inject('JraRaceRepositoryFromStorage')
        protected readonly raceRepositoryFromStorage: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
        @inject('JraRaceRepositoryFromHtml')
        protected readonly raceRepositoryFromHtml: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
    ) {
        super();
    }
}
