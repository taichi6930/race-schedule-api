import { container } from 'tsyringe';

import { PublicGamblingCalendarService } from '../../src/service/implement/publicGamblingCalendarService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';

container.register<ICalendarService>('PublicGamblingCalendarService', {
    useClass: PublicGamblingCalendarService,
});
