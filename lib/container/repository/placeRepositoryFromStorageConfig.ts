import { container } from 'tsyringe';

import type { HorseRacingPlaceEntity } from '../../src/repository/entity/horseRacingPlaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../src/repository/entity/mechanicalRacingPlaceEntity';
import { HorseRacingPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/horseRacingPlaceRepositoryFromStorageImpl';
import { JraPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import { MechanicalRacingPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/mechanicalRacingPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';

container.register<IPlaceRepository<HorseRacingPlaceEntity>>(
    'NarPlaceRepositoryFromStorage',
    {
        useClass: HorseRacingPlaceRepositoryFromStorageImpl,
    },
);
container.register<IPlaceRepository<JraPlaceEntity>>(
    'JraPlaceRepositoryFromStorage',
    {
        useClass: JraPlaceRepositoryFromStorageImpl,
    },
);
container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
    'MechanicalRacingPlaceRepositoryFromStorage',
    { useClass: MechanicalRacingPlaceRepositoryFromStorageImpl },
);
