import { container } from 'tsyringe';

import type { HorseRacingPlaceEntity } from '../../src/repository/entity/horseRacingPlaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../src/repository/entity/mechanicalRacingPlaceEntity';
import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import { JraPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import { MechanicalRacingPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/mechanicalRacingPlaceRepositoryFromStorageImpl';
import { PlaceRepositoryFromStorageImpl } from '../../src/repository/implement/placeRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';

container.register<IPlaceRepository<HorseRacingPlaceEntity>>(
    'PlaceRepositoryFromStorage',
    { useClass: PlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<PlaceEntity>>(
    'JraPlaceRepositoryFromStorage',
    { useClass: JraPlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
    'MechanicalRacingPlaceRepositoryFromStorage',
    { useClass: MechanicalRacingPlaceRepositoryFromStorageImpl },
);
