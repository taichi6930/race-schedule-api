import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../src/repository/entity/boatraceRaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../src/repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { AutoraceGoogleCalendarRepositoryImpl } from '../../src/repository/implement/autoraceGoogleCalendarRepositoryImpl';
import { BoatraceGoogleCalendarRepositoryImpl } from '../../src/repository/implement/boatraceGoogleCalendarRepositoryImpl';
import { JraGoogleCalendarRepositoryImpl } from '../../src/repository/implement/jraGoogleCalendarRepositoryImpl';
import { KeirinGoogleCalendarRepositoryImpl } from '../../src/repository/implement/keirinGoogleCalendarRepositoryImpl';
import { NarGoogleCalendarRepositoryImpl } from '../../src/repository/implement/narGoogleCalendarRepositoryImpl';
import { WorldGoogleCalendarRepositoryImpl } from '../../src/repository/implement/worldGoogleCalendarRepositoryImpl';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';

container.register<ICalendarRepository<JraRaceEntity>>(
    'JraCalendarRepository',
    { useClass: JraGoogleCalendarRepositoryImpl },
);

container.register<ICalendarRepository<NarRaceEntity>>(
    'NarCalendarRepository',
    { useClass: NarGoogleCalendarRepositoryImpl },
);

container.register<ICalendarRepository<WorldRaceEntity>>(
    'WorldCalendarRepository',
    { useClass: WorldGoogleCalendarRepositoryImpl },
);

container.register<ICalendarRepository<KeirinRaceEntity>>(
    'KeirinCalendarRepository',
    { useClass: KeirinGoogleCalendarRepositoryImpl },
);

container.register<ICalendarRepository<AutoraceRaceEntity>>(
    'AutoraceCalendarRepository',
    { useClass: AutoraceGoogleCalendarRepositoryImpl },
);

container.register<ICalendarRepository<BoatraceRaceEntity>>(
    'BoatraceCalendarRepository',
    { useClass: BoatraceGoogleCalendarRepositoryImpl },
);
