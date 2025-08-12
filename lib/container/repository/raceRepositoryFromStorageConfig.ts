import { container } from 'tsyringe';

import type { HorseRacingPlaceEntity } from '../../src/repository/entity/horseRacingPlaceEntity';
import type { HorseRacingRaceEntity } from '../../src/repository/entity/horseRacingRaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../src/repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../src/repository/entity/mechanicalRacingRaceEntity';
import type { WorldPlaceEntity } from '../../src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { AutoraceRaceRepositoryFromStorageImpl } from '../../src/repository/implement/autoraceRaceRepositoryFromStorageImpl';
import { BoatraceRaceRepositoryFromStorageImpl } from '../../src/repository/implement/boatraceRaceRepositoryFromStorageImpl';
import { JraRaceRepositoryFromStorageImpl } from '../../src/repository/implement/jraRaceRepositoryFromStorageImpl';
import { KeirinRaceRepositoryFromStorageImpl } from '../../src/repository/implement/keirinRaceRepositoryFromStorageImpl';
import { MechanicalRacingRaceRepositoryFromStorageImpl } from '../../src/repository/implement/mechanicalRacingRaceRepositoryFromStorageImpl';
import { NarRaceRepositoryFromStorageImpl } from '../../src/repository/implement/narRaceRepositoryFromStorageImpl';
import { WorldRaceRepositoryFromStorageImpl } from '../../src/repository/implement/worldRaceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';

container.register<
    IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
>('NarRaceRepositoryFromStorage', {
    useClass: NarRaceRepositoryFromStorageImpl,
});
container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
    'JraRaceRepositoryFromStorage',
    { useClass: JraRaceRepositoryFromStorageImpl },
);
container.register<
    IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
>('KeirinRaceRepositoryFromStorage', {
    useClass: KeirinRaceRepositoryFromStorageImpl,
});
container.register<
    IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
>('AutoraceRaceRepositoryFromStorage', {
    useClass: AutoraceRaceRepositoryFromStorageImpl,
});
container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
    'WorldRaceRepositoryFromStorage',
    { useClass: WorldRaceRepositoryFromStorageImpl },
);
container.register<
    IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
>('BoatraceRaceRepositoryFromStorage', {
    useClass: BoatraceRaceRepositoryFromStorageImpl,
});
container.register<
    IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
>('MechanicalRacingRaceRepositoryFromStorage', {
    useClass: MechanicalRacingRaceRepositoryFromStorageImpl,
});
