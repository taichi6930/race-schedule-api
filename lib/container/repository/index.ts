import './repositoryFromHtmlConfig';

import { container } from 'tsyringe';

import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import type { RaceEntity } from '../../src/repository/entity/raceEntity';
import { GoogleCalendarRepository } from '../../src/repository/implement/googleCalendarRepository';
import { MechanicalRacingRaceRepositoryFromStorageImpl } from '../../src/repository/implement/mechanicalRacingRaceRepositoryFromStorageImpl';
import { PlaceRepositoryFromStorageImpl } from '../../src/repository/implement/placeRepositoryFromStorageImpl';
import { PlayerRepository } from '../../src/repository/implement/playerRepository';
import { RaceRepositoryFromStorageImpl } from '../../src/repository/implement/raceRepositoryFromStorageImpl';
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

container.register<IPlaceRepository<PlaceEntity>>(
    'PlaceRepositoryFromStorage',
    { useClass: PlaceRepositoryFromStorageImpl },
);

container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
    'RaceRepositoryFromStorage',
    { useClass: RaceRepositoryFromStorageImpl },
);

container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
    'MechanicalRacingRaceRepositoryFromStorage',
    { useClass: MechanicalRacingRaceRepositoryFromStorageImpl },
);
