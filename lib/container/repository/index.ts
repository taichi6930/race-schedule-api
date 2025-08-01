import './repositoryFromHtmlConfig';
import './raceRepositoryFromStorageConfig';
import './placeRepositoryFromStorageConfig';
import './calendarRepositoryConfig';

import path from 'node:path';

import { container } from 'tsyringe';

import { SQLiteGateway } from '../../src/gateway/implement/SQLiteGateway';
import type { ISQLiteGateway } from '../../src/gateway/interface/ISQLiteGateway';
import { MockSQLiteGateway } from '../../src/gateway/mock/mockSQLiteGateway';
import { PlayerRepository } from '../../src/repository/implement/playerRepository';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';
import { allowedEnvs, ENV } from '../../src/utility/env';

// SQLiteGateway
switch (ENV) {
    case allowedEnvs.local: {
        container.register<ISQLiteGateway>('SQLiteGateway', {
            useFactory: () => {
                const dbPath = path.resolve(
                    __dirname,
                    '../../../volume/app.db',
                );
                return new SQLiteGateway(dbPath);
            },
        });
        break;
    }
    case allowedEnvs.localNoInitData:
    case allowedEnvs.localInitMadeData:
    case allowedEnvs.githubActionsCi: {
        container.register<ISQLiteGateway>('SQLiteGateway', {
            useFactory: () => {
                const dbPath = 'test/volume/app.db';
                return new MockSQLiteGateway(dbPath);
            },
        });
        break;
    }
    case allowedEnvs.production:
    case allowedEnvs.test: {
        container.register<ISQLiteGateway>('SQLiteGateway', {
            useFactory: () => {
                const dbPath = path.resolve(
                    __dirname,
                    '../../../volume/app.db',
                );
                return new SQLiteGateway(dbPath);
            },
        });
        break;
    }
}

// PlayerRepository
container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});
