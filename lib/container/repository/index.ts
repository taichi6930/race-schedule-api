import './calendarRepositoryConfig';
import './placeRepositoryFromStorageConfig';
import './raceRepositoryFromStorageConfig';
import './repositoryFromHtmlConfig';

import { container } from 'tsyringe';

import { PlaceRepository } from '../../src/repository/implement/placeRepository';
import { PlayerRepository } from '../../src/repository/implement/playerRepository';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';

// PlayerRepository
container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});

// PlaceRepository
container.register<IPlaceRepository>('PlaceRepository', {
    useClass: PlaceRepository,
});
