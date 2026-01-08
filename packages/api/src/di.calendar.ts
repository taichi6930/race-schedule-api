import { container } from 'tsyringe';

import { CalendarController } from './controller/calendarController';
import { GoogleCalendarGateway } from './gateway/implement/googleCalendarGateway';
import { GoogleCalendarRepository } from './repository/implement/googleCalendarRepository';
import { CalendarService } from './service/implement/calendarService';
import { CalendarUsecase } from './usecase/implement/calendarUsecase';

// DI登録
container.register('CalendarGateway', { useClass: GoogleCalendarGateway });
container.register('CalendarRepository', {
    useClass: GoogleCalendarRepository,
});
container.register('CalendarService', { useClass: CalendarService });
container.register('CalendarUsecase', { useClass: CalendarUsecase });

export const calendarController = container.resolve(CalendarController);
