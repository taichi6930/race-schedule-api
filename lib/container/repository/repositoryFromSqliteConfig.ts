import { container } from 'tsyringe';

import { PlayerRepositoryFromSqliteImpl } from '../../src/repository/implement/playerRepositoryFromSqliteImpl';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';
import { PlayerDataMapper } from '../../src/repository/mapper/PlayerDataMapper';
import { MockPlayerRepositoryFromSqliteImpl } from '../../src/repository/mock/mockPlayerRepositoryFromSqliteImpl';
import type { IPlayerQueryBuilder } from '../../src/repository/query/IPlayerQueryBuilder';
import { SQLitePlayerQueryBuilder } from '../../src/repository/query/SQLitePlayerQueryBuilder';
import { allowedEnvs, ENV } from '../../src/utility/env';

// Register QueryBuilder
container.register<IPlayerQueryBuilder>('IPlayerQueryBuilder', {
    useClass: SQLitePlayerQueryBuilder,
});

// Register Mapper
container.register(PlayerDataMapper, {
    useClass: PlayerDataMapper,
});

switch (ENV) {
    case allowedEnvs.production:
    case allowedEnvs.local: {
        container.register<IPlayerRepository>('PlayerRepositoryFromSqlite', {
            useClass: PlayerRepositoryFromSqliteImpl,
        });
        break;
    }

    case allowedEnvs.test:
    case allowedEnvs.localNoInitData:
    case allowedEnvs.localInitMadeData:
    case allowedEnvs.githubActionsCi: {
        container.register<IPlayerRepository>('PlayerRepositoryFromSqlite', {
            useClass: MockPlayerRepositoryFromSqliteImpl,
        });
    }
}
