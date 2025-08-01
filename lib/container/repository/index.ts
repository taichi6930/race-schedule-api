import './repositoryFromHtmlConfig';
import './raceRepositoryFromStorageConfig';
import './placeRepositoryFromStorageConfig';
import './calendarRepositoryConfig';

import { container } from 'tsyringe';

import { PlayerRepository } from '../../src/repository/implement/playerRepository';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';

// PlayerRepository
container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});
