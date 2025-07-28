import './raceDataServiceConfig';

import { container } from 'tsyringe';

import { PlayerDataService } from '../../src/service/implement/playerDataService';
import { PublicGamblingCalendarService } from '../../src/service/implement/publicGamblingCalendarService';
import { PublicGamblingPlaceDataService } from '../../src/service/implement/publicGamblingPlaceDataService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import type { IPlaceDataService } from '../../src/service/interface/IPlaceDataService';
import type { IPlayerDataService } from '../../src/service/interface/IPlayerDataService';

container.register<IPlayerDataService>('PlayerDataService', {
    useClass: PlayerDataService,
});
container.register<IPlaceDataService>('PublicGamblingPlaceDataService', {
    useClass: PublicGamblingPlaceDataService,
});
container.register<ICalendarService>('PublicGamblingCalendarService', {
    useClass: PublicGamblingCalendarService,
});
