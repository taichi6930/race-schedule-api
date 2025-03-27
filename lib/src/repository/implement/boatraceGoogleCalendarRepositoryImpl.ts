import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import { BaseGoogleCalendarRepository } from './baseGoogleCalendarRepository';

/**
 * ボートレース場開催データリポジトリの実装
 */
@injectable()
export class BoatraceGoogleCalendarRepositoryImpl extends BaseGoogleCalendarRepository<BoatraceRaceEntity> {
    public constructor(
        @inject('BoatraceGoogleCalendarGateway')
        protected readonly googleCalendarGateway: ICalendarGateway,
    ) {
        super();
    }

    /**
     * Googleカレンダーのデータをカレンダーデータに変換する
     * @param event
     */
    protected fromGoogleCalendarDataToCalendarData(
        event: object,
    ): CalendarData {
        return BoatraceRaceEntity.fromGoogleCalendarDataToCalendarData(event);
    }
}
