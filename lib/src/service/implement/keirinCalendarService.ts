import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { BaseCalendarService } from './baseCalendarService';

/**
 * Keirinカレンダーサービス
 */
@injectable()
export class KeirinCalendarService extends BaseCalendarService<KeirinRaceEntity> {
    constructor(
        @inject('KeirinCalendarRepository')
        protected readonly calendarRepository: ICalendarRepository<KeirinRaceEntity>,
    ) {
        super();
    }
}
