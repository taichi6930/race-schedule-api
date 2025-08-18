import './placeRepositoryFromStorageConfig';
import './raceRepositoryFromStorageConfig';
import './repositoryFromHtmlConfig';

import { container } from 'tsyringe';

import { GoogleCalendarRepository } from '../../src/repository/implement/googleCalendarRepository';
import { PlayerRepository } from '../../src/repository/implement/playerRepository';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';


container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});

container.register<ICalendarRepository>('CalendarRepository', {
    useClass: GoogleCalendarRepository,
});
