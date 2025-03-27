import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { BaseCalendarService } from './baseCalendarService';

/**
 * Narレースカレンダーサービス
 */
@injectable()
export class NarCalendarService extends BaseCalendarService<NarRaceEntity> {
    public constructor(
        @inject('NarCalendarRepository')
        protected readonly calendarRepository: ICalendarRepository<NarRaceEntity>,
    ) {
        super();
    }
}
