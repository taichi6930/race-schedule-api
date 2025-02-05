import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { BaseCalendarService } from './baseCalendarService';

@injectable()
export class JraCalendarService extends BaseCalendarService<JraRaceEntity> {
    constructor(
        @inject('JraCalendarRepository')
        protected readonly calendarRepository: ICalendarRepository<JraRaceEntity>,
    ) {
        super();
    }
}
