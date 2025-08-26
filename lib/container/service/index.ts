import { container } from 'tsyringe';

import { PlayerDataService } from '../../src/service/implement/playerDataService';
import { PublicGamblingCalendarService } from '../../src/service/implement/publicGamblingCalendarService';
import { PublicGamblingPlaceService } from '../../src/service/implement/publicGamblingPlaceService';
import { PublicGamblingRaceDataService } from '../../src/service/implement/publicGamblingRaceDataService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import type { IPlaceService } from '../../src/service/interface/IPlaceService';
import type { IPlayerDataService } from '../../src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../src/service/interface/IRaceDataService';

container.register<IPlayerDataService>('PlayerDataService', {
    useClass: PlayerDataService,
});
container.register<IPlaceService>('PublicGamblingPlaceService', {
    useClass: PublicGamblingPlaceService,
});
container.register<ICalendarService>('PublicGamblingCalendarService', {
    useClass: PublicGamblingCalendarService,
});
container.register<IRaceDataService>('PublicGamblingRaceDataService', {
    useClass: PublicGamblingRaceDataService,
});
