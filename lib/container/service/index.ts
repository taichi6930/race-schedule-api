import { container } from 'tsyringe';

import { CalendarService } from '../../src/service/implement/calendarService';
import { PlaceService } from '../../src/service/implement/placeService';
import { PlayerService } from '../../src/service/implement/playerService';
import { RaceService } from '../../src/service/implement/raceService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import type { IPlaceService } from '../../src/service/interface/IPlaceService';
import type { IPlayerService } from '../../src/service/interface/IPlayerService';
import type { IRaceService } from '../../src/service/interface/IRaceService';

container.register<IPlayerService>('PlayerDataService', {
    useClass: PlayerService,
});
container.register<IPlaceService>('PublicGamblingPlaceService', {
    useClass: PlaceService,
});
container.register<ICalendarService>('PublicGamblingCalendarService', {
    useClass: CalendarService,
});
container.register<IRaceService>('PublicGamblingRaceService', {
    useClass: RaceService,
});
