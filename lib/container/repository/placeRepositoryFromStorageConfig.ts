import { container } from 'tsyringe';

import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../src/repository/entity/mechanicalRacingPlaceEntity';
import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import { JraPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import { MechanicalRacingPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/mechanicalRacingPlaceRepositoryFromStorageImpl';
import { NarPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/narPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';

container.register<IPlaceRepository<PlaceEntity>>(
    'NarPlaceRepositoryFromStorage',
    { useClass: NarPlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<JraPlaceEntity>>(
    'JraPlaceRepositoryFromStorage',
    { useClass: JraPlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
    'MechanicalRacingPlaceRepositoryFromStorage',
    { useClass: MechanicalRacingPlaceRepositoryFromStorageImpl },
);
