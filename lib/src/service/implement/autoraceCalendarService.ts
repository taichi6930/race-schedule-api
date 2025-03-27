import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { BaseCalendarService } from './baseCalendarService';

/**
 * Autoraceカレンダーサービス
 */
@injectable()
export class AutoraceCalendarService extends BaseCalendarService<AutoraceRaceEntity> {
    public constructor(
        @inject('AutoraceCalendarRepository')
        protected readonly calendarRepository: ICalendarRepository<AutoraceRaceEntity>,
    ) {
        super();
    }
}
