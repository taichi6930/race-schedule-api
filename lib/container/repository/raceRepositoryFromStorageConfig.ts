import { container } from 'tsyringe';

import type { HorseRacingPlaceEntity } from '../../src/repository/entity/horseRacingPlaceEntity';
import type { HorseRacingRaceEntity } from '../../src/repository/entity/horseRacingRaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../src/repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../src/repository/entity/mechanicalRacingRaceEntity';
import { HorseRacingRaceRepositoryFromStorageImpl } from '../../src/repository/implement/horseRacingRaceRepositoryFromStorageImpl';
import { JraRaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraRaceRepositoryFromStorageImpl';
import { MechanicalRacingRaceRepositoryFromStorageImpl } from '../../src/repository/implement/mechanicalRacingRaceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';

container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
    'JraRaceRepositoryFromStorage',
    {
        useClass: JraRaceRepositoryFromStorageImpl,
    },
);
container.register<
    IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
>('HorseRacingRaceRepositoryFromStorage', {
    useClass: HorseRacingRaceRepositoryFromStorageImpl,
});
container.register<
    IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
>('MechanicalRacingRaceRepositoryFromStorage', {
    useClass: MechanicalRacingRaceRepositoryFromStorageImpl,
});
