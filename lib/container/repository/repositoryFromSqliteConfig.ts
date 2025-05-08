import { container } from 'tsyringe';

import { PlayerRepositoryFromSqliteImpl } from '../../src/repository/implement/playerRepositoryFromSqliteImpl';
import type { IPlayerRepository } from '../../src/repository/interface/IPlayerRepository';
import { MockPlayerRepositoryFromSqliteImpl } from '../../src/repository/mock/mockPlayerRepositoryFromSqliteImpl';
import { allowedEnvs, ENV } from '../../src/utility/env';

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
