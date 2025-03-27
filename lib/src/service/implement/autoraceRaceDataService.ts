import { inject, injectable } from 'tsyringe';

import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { BaseRaceDataService } from './baseRaceDataService';

/**
 * Autoraceレースデータサービス
 */
@injectable()
export class AutoraceRaceDataService extends BaseRaceDataService<
    AutoraceRaceEntity,
    AutoracePlaceEntity
> {
    public constructor(
        @inject('AutoraceRaceRepositoryFromStorage')
        protected readonly raceRepositoryFromStorage: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromHtml')
        protected readonly raceRepositoryFromHtml: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >,
    ) {
        super();
    }
}
