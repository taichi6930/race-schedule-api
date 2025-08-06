import './calendarGatewayConfig';
import './htmlGatewayConfig';
import './s3GatewayConfig';

import path from 'node:path';

import { container } from 'tsyringe';

import { SQLiteGateway } from '../../src/gateway/implement/SQLiteGateway';
import type { ISQLiteGateway } from '../../src/gateway/interface/ISQLiteGateway';
import { MockSQLiteGateway } from '../../src/gateway/mock/mockSQLiteGateway';
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
                return new SQLiteGateway({
                    // dbPath?: string; // ローカル環境用のDBパス
                    // bucketName?: string; // S3バケット名
                    // s3Key?: string; // S3内のDBファイルのキー
                    dbPath: dbPath,
                });
            },
        });
        break;
    }
    case allowedEnvs.test: {
        container.register<ISQLiteGateway>('SQLiteGateway', {
            useFactory: () => {
                return new SQLiteGateway({
                    // dbPath?: string; // ローカル環境用のDBパス
                    // bucketName?: string; // S3バケット名
                    // s3Key?: string; // S3内のDBファイルのキー
                    bucketName: 'race-schedule-bucket-test',
                    s3Key: 'db/app.db',
                });
            },
        });
        break;
    }
    case allowedEnvs.production:
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
