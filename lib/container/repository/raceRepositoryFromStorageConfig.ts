import { container } from 'tsyringe';

import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import type { RaceEntity } from '../../src/repository/entity/raceEntity';
import { HorseRacingRaceRepositoryFromStorageImpl } from '../../src/repository/implement/horseRacingRaceRepositoryFromStorageImpl';
import { JraRaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraRaceRepositoryFromStorageImpl';
import { MechanicalRacingRaceRepositoryFromStorageImpl } from '../../src/repository/implement/mechanicalRacingRaceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';

container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
    'JraRaceRepositoryFromStorage',
    {
        useClass: JraRaceRepositoryFromStorageImpl,
    },
);
container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
    'HorseRacingRaceRepositoryFromStorage',
    {
        useClass: HorseRacingRaceRepositoryFromStorageImpl,
    },
);
container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
    'MechanicalRacingRaceRepositoryFromStorage',
    {
        useClass: MechanicalRacingRaceRepositoryFromStorageImpl,
    },
);
