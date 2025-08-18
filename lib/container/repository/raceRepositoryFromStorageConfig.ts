import { container } from 'tsyringe';

import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import type { RaceEntity } from '../../src/repository/entity/raceEntity';
import { MechanicalRacingRaceRepositoryFromStorageImpl } from '../../src/repository/implement/mechanicalRacingRaceRepositoryFromStorageImpl';
import { RaceRepositoryFromStorageImpl } from '../../src/repository/implement/raceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';

container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
    'RaceRepositoryFromStorage',
    {
        useClass: RaceRepositoryFromStorageImpl,
    },
);
container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
    'MechanicalRacingRaceRepositoryFromStorage',
    {
        useClass: MechanicalRacingRaceRepositoryFromStorageImpl,
    },
);
