import { container } from 'tsyringe';

import { GoogleCalendarRepository } from '../../src/repository/implement/googleCalendarRepository';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';

container.register<ICalendarRepository>('CalendarRepository', {
    useClass: GoogleCalendarRepository,
});
