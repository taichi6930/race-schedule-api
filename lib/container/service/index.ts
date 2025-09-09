import { container } from 'tsyringe';

import { CalendarServiceForAWS } from '../../src/service/implement/calendarService';
import { PlaceServiceForAWS } from '../../src/service/implement/placeService';
import { PlayerServiceForAWS } from '../../src/service/implement/playerService';
import { RaceServiceForAWS } from '../../src/service/implement/raceService';
import type { ICalendarServiceForAWS } from '../../src/service/interface/ICalendarService';
import type { IPlaceServiceForAWS } from '../../src/service/interface/IPlaceService';
import type { IPlayerServiceForAWS } from '../../src/service/interface/IPlayerService';
import type { IRaceServiceForAWS } from '../../src/service/interface/IRaceService';

container.register<IPlayerServiceForAWS>('PlayerDataService', {
    useClass: PlayerServiceForAWS,
});
container.register<IPlaceServiceForAWS>('PlaceService', {
    useClass: PlaceServiceForAWS,
});
container.register<ICalendarServiceForAWS>('CalendarService', {
    useClass: CalendarServiceForAWS,
});
container.register<IRaceServiceForAWS>('RaceService', {
    useClass: RaceServiceForAWS,
});
