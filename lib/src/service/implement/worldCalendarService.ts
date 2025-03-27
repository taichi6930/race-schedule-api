import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { BaseCalendarService } from './baseCalendarService';

/**
 * Worldレースカレンダーサービス
 */
@injectable()
export class WorldCalendarService extends BaseCalendarService<WorldRaceEntity> {
    public constructor(
        @inject('WorldCalendarRepository')
        protected readonly calendarRepository: ICalendarRepository<WorldRaceEntity>,
    ) {
        super();
    }
}
