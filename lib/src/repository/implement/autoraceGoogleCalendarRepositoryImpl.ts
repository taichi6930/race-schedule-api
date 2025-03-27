import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
import { BaseGoogleCalendarRepository } from './baseGoogleCalendarRepository';
/**
 * オートレース場開催データリポジトリの実装
 */
@injectable()
export class AutoraceGoogleCalendarRepositoryImpl extends BaseGoogleCalendarRepository<AutoraceRaceEntity> {
    public constructor(
        @inject('AutoraceGoogleCalendarGateway')
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
        return AutoraceRaceEntity.fromGoogleCalendarDataToCalendarData(event);
    }
}
