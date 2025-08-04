import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../src/repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../../src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import type { WorldPlaceEntity } from '../../src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { AutoraceRaceRepositoryFromStorageImpl } from '../../src/repository/implement/autoraceRaceRepositoryFromStorageImpl';
import { BoatraceRaceRepositoryFromStorageImpl } from '../../src/repository/implement/boatraceRaceRepositoryFromStorageImpl';
import { JraRaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraRaceRepositoryFromStorageImpl';
import { KeirinRaceRepositoryFromStorageImpl } from '../../src/repository/implement/keirinRaceRepositoryFromStorageImpl';
import { NarRaceRepositoryFromStorageImpl } from '../../src/repository/implement/narRaceRepositoryFromStorageImpl';
import { WorldRaceRepositoryFromStorageImpl } from '../../src/repository/implement/worldRaceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';
container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
    'NarRaceRepositoryFromStorage',
    { useClass: NarRaceRepositoryFromStorageImpl },
);
container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
    'JraRaceRepositoryFromStorage',
    { useClass: JraRaceRepositoryFromStorageImpl },
);
container.register<IRaceRepository<KeirinRaceEntity, PlaceEntity>>(
    'KeirinRaceRepositoryFromStorage',
    { useClass: KeirinRaceRepositoryFromStorageImpl },
);
container.register<IRaceRepository<AutoraceRaceEntity, PlaceEntity>>(
    'AutoraceRaceRepositoryFromStorage',
    { useClass: AutoraceRaceRepositoryFromStorageImpl },
);
container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
    'WorldRaceRepositoryFromStorage',
    { useClass: WorldRaceRepositoryFromStorageImpl },
);
container.register<IRaceRepository<BoatraceRaceEntity, PlaceEntity>>(
    'BoatraceRaceRepositoryFromStorage',
    { useClass: BoatraceRaceRepositoryFromStorageImpl },
);
