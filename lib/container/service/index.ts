import { container } from 'tsyringe';

import { PublicGamblingCalendarService } from '../../src/service/implement/calendarService';
import { PublicGamblingPlaceService } from '../../src/service/implement/placeService';
import { PlayerService } from '../../src/service/implement/playerService';
import { PublicGamblingRaceService } from '../../src/service/implement/raceService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import type { IPlaceService } from '../../src/service/interface/IPlaceService';
import type { IPlayerService } from '../../src/service/interface/IPlayerService';
import type { IRaceService } from '../../src/service/interface/IRaceService';

container.register<IPlayerService>('PlayerDataService', {
    useClass: PlayerService,
});
container.register<IPlaceService>('PublicGamblingPlaceService', {
    useClass: PublicGamblingPlaceService,
});
container.register<ICalendarService>('PublicGamblingCalendarService', {
    useClass: PublicGamblingCalendarService,
});
container.register<IRaceService>('PublicGamblingRaceService', {
    useClass: PublicGamblingRaceService,
});
