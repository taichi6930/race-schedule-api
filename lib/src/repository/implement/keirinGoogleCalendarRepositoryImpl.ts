import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { IOldCalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { BaseGoogleCalendarRepository } from './baseGoogleCalendarRepository';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class KeirinGoogleCalendarRepositoryImpl extends BaseGoogleCalendarRepository<KeirinRaceEntity> {
    public constructor(
        @inject('KeirinGoogleCalendarGateway')
        protected readonly googleCalendarGateway: IOldCalendarGateway,
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
        return KeirinRaceEntity.fromGoogleCalendarDataToCalendarData(event);
    }
}
