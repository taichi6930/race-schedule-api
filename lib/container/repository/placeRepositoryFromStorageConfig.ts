import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../src/repository/entity/autoracePlaceEntity';
import type { BoatracePlaceEntity } from '../../src/repository/entity/boatracePlaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { KeirinPlaceEntity } from '../../src/repository/entity/keirinPlaceEntity';
import type { NarPlaceEntity } from '../../src/repository/entity/narPlaceEntity';
import { AutoracePlaceRepositoryFromStorageImpl } from '../../src/repository/implement/autoracePlaceRepositoryFromStorageImpl';
import { BoatracePlaceRepositoryFromStorageImpl } from '../../src/repository/implement/boatracePlaceRepositoryFromStorageImpl';
import { JraPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import { KeirinPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { NarPlaceRepositoryFromStorageImpl } from '../../src/repository/implement/narPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';

// if (ENV === allowedEnvs.local) {
//     container.register<IPlaceRepository<NarPlaceEntity>>(
//         'NarPlaceRepositoryFromStorage',
//         { useClass: NarPlaceRepositoryFromSqliteImpl },
//     );
// } else {
container.register<IPlaceRepository<NarPlaceEntity>>(
    'NarPlaceRepositoryFromStorage',
    { useClass: NarPlaceRepositoryFromStorageImpl },
);
// }
// if (ENV === allowedEnvs.local) {
//     container.register<IPlaceRepository<JraPlaceEntity>>(
//         'JraPlaceRepositoryFromStorage',
//         { useClass: JraPlaceRepositoryFromSqliteImpl },
//     );
// } else {
container.register<IPlaceRepository<JraPlaceEntity>>(
    'JraPlaceRepositoryFromStorage',
    { useClass: JraPlaceRepositoryFromStorageImpl },
);
// }
container.register<IPlaceRepository<KeirinPlaceEntity>>(
    'KeirinPlaceRepositoryFromStorage',
    { useClass: KeirinPlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<AutoracePlaceEntity>>(
    'AutoracePlaceRepositoryFromStorage',
    { useClass: AutoracePlaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<BoatracePlaceEntity>>(
    'BoatracePlaceRepositoryFromStorage',
    { useClass: BoatracePlaceRepositoryFromStorageImpl },
);
