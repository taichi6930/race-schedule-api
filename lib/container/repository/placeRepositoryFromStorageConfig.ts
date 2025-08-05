import { container } from 'tsyringe';

import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../src/repository/entity/mechanicalRacingPlaceEntity';
import type { NarPlaceEntity } from '../../src/repository/entity/narPlaceEntity';
import { AutoracePlaceRepositoryFromStorageImpl } from '../../src/repository/implement/autoracePlaceRepositoryFromStorageImpl';
import { BoatracePlaceRepositoryFromStorageImpl } from '../../src/repository/implement/boatracePlaceRepositoryFromStorageImpl';
import { JraPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import { KeirinPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { NarPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/narPlaceRepositoryFromStorageImpl';
import type { IOldPlaceRepository } from '../../src/repository/interface/IPlaceRepository';

container.register<IOldPlaceRepository<NarPlaceEntity>>(
    'NarPlaceRepositoryFromStorage',
    { useClass: NarPlaceRepositoryFromStorageImpl },
);
container.register<IOldPlaceRepository<JraPlaceEntity>>(
    'JraPlaceRepositoryFromStorage',
    { useClass: JraPlaceRepositoryFromStorageImpl },
);
container.register<IOldPlaceRepository<MechanicalRacingPlaceEntity>>(
    'KeirinPlaceRepositoryFromStorage',
    { useClass: KeirinPlaceRepositoryFromStorageImpl },
);
container.register<IOldPlaceRepository<MechanicalRacingPlaceEntity>>(
    'AutoracePlaceRepositoryFromStorage',
    { useClass: AutoracePlaceRepositoryFromStorageImpl },
);
container.register<IOldPlaceRepository<MechanicalRacingPlaceEntity>>(
    'BoatracePlaceRepositoryFromStorage',
    { useClass: BoatracePlaceRepositoryFromStorageImpl },
);
