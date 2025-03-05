import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { BaseGoogleCalendarRepository } from './baseGoogleCalendarRepository';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class JraGoogleCalendarRepositoryImpl extends BaseGoogleCalendarRepository<JraRaceEntity> {
    constructor(
        @inject('JraGoogleCalendarGateway')
        protected readonly googleCalendarGateway: ICalendarGateway,
    ) {
        super();
    }

    protected fromGoogleCalendarDataToCalendarData(
        event: object,
    ): CalendarData {
        return JraRaceEntity.fromGoogleCalendarDataToCalendarData(event);
    }
}
