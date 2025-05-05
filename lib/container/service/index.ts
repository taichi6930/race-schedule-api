import './raceDataServiceConfig';
import './placeDataServiceConfig';
import './calendarServiceConfig';

import { container } from 'tsyringe';

import { PlayerDataService } from '../../src/service/implement/playerDataService';
import type { IPlayerDataService } from '../../src/service/interface/IPlayerDataService';

container.register<IPlayerDataService>('PlayerDataService', {
    useClass: PlayerDataService,
});
