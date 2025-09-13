import { container } from 'tsyringe';

import { CalendarServiceForAWS } from '../../src/service/implement/calendarServiceForAWS';
import { PlaceServiceForAWS } from '../../src/service/implement/placeServiceForAWS';
import { PlayerServiceForAWS } from '../../src/service/implement/playerServiceForAWS';
import { RaceServiceForAWS } from '../../src/service/implement/raceServiceForAWS';
import type { ICalendarServiceForAWS } from '../../src/service/interface/ICalendarServiceForAWS';
import type { IPlaceServiceForAWS } from '../../src/service/interface/IPlaceServiceForAWS';
import type { IPlayerServiceForAWS } from '../../src/service/interface/IPlayerServiceForAWS';
import type { IRaceServiceForAWS } from '../../src/service/interface/IRaceServiceForAWS';

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
