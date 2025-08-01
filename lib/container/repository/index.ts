import './repositoryFromHtmlConfig';
import './raceRepositoryFromStorageConfig';
import './placeRepositoryFromStorageConfig';
import './calendarRepositoryConfig';

import path from 'node:path';

import { container } from 'tsyringe';

import { SQLiteGateway } from '../../src/gateway/implement/SQLiteGateway';
import type { ISQLiteGateway } from '../../src/gateway/interface/ISQLiteGateway';
import { PlayerRepository } from '../../src/repository/implement/PlayerRepository';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';

// SQLiteGateway
container.register<ISQLiteGateway>('SQLiteGateway', {
    useFactory: () => {
        const dbPath = path.resolve(__dirname, '../../../volume/app.db');
        return new SQLiteGateway(dbPath);
    },
});

// PlayerRepository
container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});
