import { container } from 'tsyringe';

import { CalendarController } from './controller/calendarController';
import { GoogleCalendarGateway } from './gateway/implement/googleCalendarGateway';
import { GoogleCalendarRepository } from './repository/implement/googleCalendarRepository';
import { CalendarService } from './service/implement/calendarService';
import { CalendarUseCase } from './usecase/implement/calendarUseCase';

// DI登録
container.register('ICalendarRepository', {
    useClass: GoogleCalendarRepository,
});
container.register('ICalendarGateway', { useClass: GoogleCalendarGateway });
container.register('ICalendarService', { useClass: CalendarService });
container.register('CalendarUseCase', { useClass: CalendarUseCase });

export const calendarController = container.resolve(CalendarController);
