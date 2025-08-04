import { container } from 'tsyringe';

import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { NarPlaceEntity } from '../../src/repository/entity/narPlaceEntity';
import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import { AutoracePlaceRepositoryFromStorageImpl } from '../../src/repository/implement/autoracePlaceRepositoryFromStorageImpl';
import { BoatracePlaceRepositoryFromStorageImpl } from '../../src/repository/implement/boatracePlaceRepositoryFromStorageImpl';
import { JraPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import { KeirinPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { NarPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/narPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';

container.register<IPlaceRepository<NarPlaceEntity>>(
    'NarPlaceRepositoryFromStorage',
    { useClass: NarPlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<JraPlaceEntity>>(
    'JraPlaceRepositoryFromStorage',
    { useClass: JraPlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<PlaceEntity>>(
    'KeirinPlaceRepositoryFromStorage',
    { useClass: KeirinPlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<PlaceEntity>>(
    'AutoracePlaceRepositoryFromStorage',
    { useClass: AutoracePlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<PlaceEntity>>(
    'BoatracePlaceRepositoryFromStorage',
    { useClass: BoatracePlaceRepositoryFromStorageImpl },
);
