import { inject, injectable } from 'tsyringe';

import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { BaseRaceDataService } from './baseRaceDataService';

@injectable()
export class WorldRaceDataService extends BaseRaceDataService<
    WorldRaceEntity,
    WorldPlaceEntity
> {
    constructor(
        @inject('WorldRaceRepositoryFromStorage')
        protected readonly raceRepositoryFromStorage: IRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
        @inject('WorldRaceRepositoryFromHtml')
        protected readonly raceRepositoryFromHtml: IRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
    ) {
        super();
    }
}
