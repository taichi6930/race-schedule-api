import { container } from 'tsyringe';

import { PlayerDataService } from '../../src/service/implement/playerDataService';
import { PublicGamblingCalendarService } from '../../src/service/implement/publicGamblingCalendarService';
import { PublicGamblingPlaceService } from '../../src/service/implement/publicGamblingPlaceService';
import { PublicGamblingRaceService } from '../../src/service/implement/publicGamblingRaceService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import type { IPlaceService } from '../../src/service/interface/IPlaceService';
import type { IPlayerDataService } from '../../src/service/interface/IPlayerDataService';
import type { IRaceService } from '../../src/service/interface/IRaceService';

container.register<IPlayerDataService>('PlayerDataService', {
    useClass: PlayerDataService,
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
