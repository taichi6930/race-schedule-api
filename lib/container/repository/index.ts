import './repositoryFromHtmlConfig';

import { container } from 'tsyringe';

import { GoogleCalendarRepositoryForAWS } from '../../src/repository/implement/googleCalendarRepository';
import { HorseRacingRaceRepositoryFromStorage } from '../../src/repository/implement/horseRacingRaceRepositoryFromStorage';
import { MechanicalRacingRaceRepositoryFromStorage } from '../../src/repository/implement/mechanicalRacingRaceRepositoryFromStorage';
import { PlaceRepositoryFromStorage } from '../../src/repository/implement/placeRepositoryFromStorage';
import { PlayerRepository } from '../../src/repository/implement/playerRepository';
import type { ICalendarRepositoryForAWS } from '../../src/repository/interface/ICalendarRepository';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';
import type { IRaceRepositoryForAWS } from '../../src/repository/interface/IRaceRepositoryForAWS';

container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});

container.register<ICalendarRepositoryForAWS>('CalendarRepository', {
    useClass: GoogleCalendarRepositoryForAWS,
});

container.register<IPlaceRepository>('PlaceRepositoryFromStorage', {
    useClass: PlaceRepositoryFromStorage,
});

container.register<IRaceRepositoryForAWS>(
    'HorseRacingRaceRepositoryFromStorage',
    {
        useClass: HorseRacingRaceRepositoryFromStorage,
    },
);

container.register<IRaceRepositoryForAWS>(
    'MechanicalRacingRaceRepositoryFromStorage',
    { useClass: MechanicalRacingRaceRepositoryFromStorage },
);
