import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../src/repository/entity/boatraceRaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../src/repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { AutoraceCalendarService } from '../../src/service/implement/autoraceCalendarService';
import { BoatraceCalendarService } from '../../src/service/implement/boatraceCalendarService';
import { JraCalendarService } from '../../src/service/implement/jraCalendarService';
import { KeirinCalendarService } from '../../src/service/implement/keirinCalendarService';
import { NarCalendarService } from '../../src/service/implement/narCalendarService';
import { PublicGamblingCalendarService } from '../../src/service/implement/publicGamblingCalendarService';
import { WorldCalendarService } from '../../src/service/implement/worldCalendarService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import type { IOldCalendarService } from '../../src/service/interface/IOldCalendarService';

container.register<IOldCalendarService<NarRaceEntity>>('NarCalendarService', {
    useClass: NarCalendarService,
});
container.register<IOldCalendarService<JraRaceEntity>>('JraCalendarService', {
    useClass: JraCalendarService,
});
container.register<IOldCalendarService<KeirinRaceEntity>>(
    'KeirinCalendarService',
    {
        useClass: KeirinCalendarService,
    },
);
container.register<IOldCalendarService<AutoraceRaceEntity>>(
    'AutoraceCalendarService',
    {
        useClass: AutoraceCalendarService,
    },
);
container.register<IOldCalendarService<BoatraceRaceEntity>>(
    'BoatraceCalendarService',
    {
        useClass: BoatraceCalendarService,
    },
);
container.register<IOldCalendarService<WorldRaceEntity>>(
    'WorldCalendarService',
    {
        useClass: WorldCalendarService,
    },
);
container.register<ICalendarService>('PublicGamblingCalendarService', {
    useClass: PublicGamblingCalendarService,
});
