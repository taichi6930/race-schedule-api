import './repositoryFromHtmlConfig';

import { container } from 'tsyringe';

import { GoogleCalendarRepository } from '../../src/repository/implement/googleCalendarRepository';
import { HorseRacingRaceRepositoryFromStorage } from '../../src/repository/implement/horseRacingRaceRepositoryFromStorage';
import { MechanicalRacingRaceRepositoryFromStorage } from '../../src/repository/implement/mechanicalRacingRaceRepositoryFromStorage';
import { PlaceRepositoryFromStorage } from '../../src/repository/implement/placeRepositoryFromStorage';
import { PlayerRepository } from '../../src/repository/implement/playerRepository';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';

container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});

container.register<ICalendarRepository>('CalendarRepository', {
    useClass: GoogleCalendarRepository,
});

container.register<IPlaceRepository>('PlaceRepositoryFromStorage', {
    useClass: PlaceRepositoryFromStorage,
});

container.register<IRaceRepository>('HorseRacingRaceRepositoryFromStorage', {
    useClass: HorseRacingRaceRepositoryFromStorage,
});

container.register<IRaceRepository>(
    'MechanicalRacingRaceRepositoryFromStorage',
    { useClass: MechanicalRacingRaceRepositoryFromStorage },
);
