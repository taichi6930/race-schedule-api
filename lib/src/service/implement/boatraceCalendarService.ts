import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { BaseCalendarService } from './baseCalendarService';

/**
 * Boatraceカレンダーサービス
 */
@injectable()
export class BoatraceCalendarService extends BaseCalendarService<BoatraceRaceEntity> {
    /**
     *
     * @param calendarRepository
     */
    public constructor(
        @inject('BoatraceCalendarRepository')
        protected readonly calendarRepository: ICalendarRepository<BoatraceRaceEntity>,
    ) {
        super();
    }
}
