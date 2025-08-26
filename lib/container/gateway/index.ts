import { container } from 'tsyringe';

import { GoogleCalendarGateway } from '../../src/gateway/implement/googleCalendarGateway';
import { PlaceDataHtmlGateway } from '../../src/gateway/implement/placeDataHtmlGateway';
import { RaceDataHtmlGateway } from '../../src/gateway/implement/raceDataHtmlGateway';
import { S3Gateway } from '../../src/gateway/implement/s3Gateway';
import type { ICalendarGateway } from '../../src/gateway/interface/iCalendarGateway';
import type { IPlaceDataHtmlGateway } from '../../src/gateway/interface/iPlaceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from '../../src/gateway/interface/iRaceDataHtmlGateway';
import type { IS3Gateway } from '../../src/gateway/interface/iS3Gateway';
import type { ISQLiteGateway } from '../../src/gateway/interface/ISQLiteGateway';
import { MockGoogleCalendarGateway } from '../../src/gateway/mock/mockGoogleCalendarGateway';
import { MockPlaceDataHtmlGateway } from '../../src/gateway/mock/mockPlaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../src/gateway/mock/mockRaceDataHtmlGateway';
import { MockS3Gateway } from '../../src/gateway/mock/mockS3Gateway';
import { MockSQLiteGateway } from '../../src/gateway/mock/mockSQLiteGateway';
import { SqliteS3Gateway } from '../../src/gateway/sqliteS3Gateway';
import { allowedEnvs, ENV } from '../../src/utility/env';

// SQLiteGateway
// Production/Test: use S3-backed gateway; Local/CI: use Mock gateway
switch (ENV) {
    case allowedEnvs.production: {
        container.register<ISQLiteGateway>('SQLiteGateway', {
            useFactory: () => {
                const bucket =
                    process.env.S3_SQLITE_BUCKET ?? 'race-schedule-bucket';
                const key = process.env.S3_SQLITE_KEY ?? 'prod/db.sqlite';
                const tmpPath = process.env.SQLITE_TMP_PATH ?? '/tmp/db.sqlite';
                return new SqliteS3Gateway(bucket, key, tmpPath);
            },
        });
        break;
    }
    case allowedEnvs.test: {
        container.register<ISQLiteGateway>('SQLiteGateway', {
            useFactory: () => {
                const bucket =
                    process.env.S3_SQLITE_BUCKET ?? 'race-schedule-bucket-test';
                const key = process.env.S3_SQLITE_KEY ?? 'test/db.sqlite';
                const tmpPath = process.env.SQLITE_TMP_PATH ?? '/tmp/db.sqlite';
                return new SqliteS3Gateway(bucket, key, tmpPath);
            },
        });
        break;
    }
    case allowedEnvs.local:
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
    default: {
        // Fallback to mock for safety
        container.register<ISQLiteGateway>('SQLiteGateway', {
            useFactory: () => new MockSQLiteGateway('test/volume/app.db'),
        });
    }
}

container.register<ICalendarGateway>('GoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new GoogleCalendarGateway();
            }
            case allowedEnvs.test: {
                return new GoogleCalendarGateway();
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockGoogleCalendarGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IPlaceDataHtmlGateway>('PlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new PlaceDataHtmlGateway();
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockPlaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IRaceDataHtmlGateway>('RaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new RaceDataHtmlGateway();
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockRaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IS3Gateway>('S3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway('race-schedule-bucket');
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway('race-schedule-bucket-test');
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
                return new MockS3Gateway('race-schedule-bucket');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
