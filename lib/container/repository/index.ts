import './repositoryFromHtmlConfig';

import { container } from 'tsyringe';

import { GoogleCalendarRepositoryForAWS } from '../../src/repository/implement/googleCalendarRepository';
import { HorseRacingRaceRepositoryFromStorage } from '../../src/repository/implement/horseRacingRaceRepositoryFromStorage';
import { MechanicalRacingRaceRepositoryFromStorage } from '../../src/repository/implement/mechanicalRacingRaceRepositoryFromStorage';
import { PlaceRepositoryFromStorageForAWS } from '../../src/repository/implement/placeRepositoryFromStorage';
import { PlayerRepositoryForAWS } from '../../src/repository/implement/playerRepository';
import type { ICalendarRepositoryForAWS } from '../../src/repository/interface/ICalendarRepositoryForAWS';
import type { IPlaceRepositoryForAWS } from '../../src/repository/interface/IPlaceRepositoryForAWS';
import type { IPlayerRepositoryForAWS } from '../../src/repository/interface/IPlayerRepositoryForAWS';
import type { IRaceRepositoryForAWS } from '../../src/repository/interface/IRaceRepositoryForAWS';

container.register<IPlayerRepositoryForAWS>('PlayerRepository', {
    useClass: PlayerRepositoryForAWS,
});

container.register<ICalendarRepositoryForAWS>('CalendarRepository', {
    useClass: GoogleCalendarRepositoryForAWS,
});

container.register<IPlaceRepositoryForAWS>('PlaceRepositoryFromStorage', {
    useClass: PlaceRepositoryFromStorageForAWS,
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
