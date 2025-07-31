import './repositoryFromHtmlConfig';
import './raceRepositoryFromStorageConfig';
import './placeRepositoryFromStorageConfig';
import './calendarRepositoryConfig';

import { container } from 'tsyringe';

import { SQLiteGateway } from '../../src/gateway/implement/SQLiteGateway';
import type { ISQLiteGateway } from '../../src/gateway/interface/ISQLiteGateway';
import { PlayerRepository } from '../../src/repository/implement/PlayerRepository';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';

// SQLiteGateway
container.register<ISQLiteGateway>('SQLiteGateway', {
    useFactory: () => new SQLiteGateway('volume/app.db'),
});

// PlayerRepository
container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});
