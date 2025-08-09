import './calendarGatewayConfig';
import './htmlGatewayConfig';
import './s3GatewayConfig';

import { container } from 'tsyringe';

import type { ISQLiteGateway } from '../../src/gateway/interface/ISQLiteGateway';
import { MockSQLiteGateway } from '../../src/gateway/mock/mockSQLiteGateway';
import { allowedEnvs, ENV } from '../../src/utility/env';

// SQLiteGateway
switch (ENV) {
    // case allowedEnvs.local: {
    //     container.register<ISQLiteGateway>('SQLiteGateway', {
    //         useFactory: () => {
    //             const dbPath = path.resolve(
    //                 __dirname,
    //                 '../../../volume/app.db',
    //             );
    //             return new SQLiteGateway(dbPath);
    //         },
    //     });
    //     break;
    // }
    case allowedEnvs.local:
    case allowedEnvs.production:
    case allowedEnvs.test:
    case allowedEnvs.localNoInitData:
    case allowedEnvs.localInitMadeData:
    case allowedEnvs.githubActionsCi: {
        {
            container.register<ISQLiteGateway>('SQLiteGateway', {
                useFactory: () => {
                    const dbPath = 'test/volume/app.db';
                    return new MockSQLiteGateway(dbPath);
                },
            });
            break;
        }
    }
}
