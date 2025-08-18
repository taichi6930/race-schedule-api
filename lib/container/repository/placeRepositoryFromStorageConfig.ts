import { container } from 'tsyringe';

import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import { PlaceRepositoryFromStorageImpl } from '../../src/repository/implement/placeRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';

container.register<IPlaceRepository<PlaceEntity>>(
    'PlaceRepositoryFromStorage',
    { useClass: PlaceRepositoryFromStorageImpl },
);
