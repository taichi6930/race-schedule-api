import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { NarRaceEntity } from '../entity/narRaceEntity';
import { BaseGoogleCalendarRepository } from './baseGoogleCalendarRepository';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class NarGoogleCalendarRepositoryImpl extends BaseGoogleCalendarRepository<NarRaceEntity> {
    /**
     *
     * @param googleCalendarGateway
     */
    public constructor(
        @inject('NarGoogleCalendarGateway')
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
        return NarRaceEntity.fromGoogleCalendarDataToCalendarData(event);
    }
}
