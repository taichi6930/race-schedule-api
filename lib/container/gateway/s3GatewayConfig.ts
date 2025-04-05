import { container } from 'tsyringe';

import { S3Gateway } from '../../src/gateway/implement/s3Gateway';
import type { IS3Gateway } from '../../src/gateway/interface/iS3Gateway';
import { MockS3Gateway } from '../../src/gateway/mock/mockS3Gateway';
import type { AutoracePlaceRecord } from '../../src/gateway/record/autoracePlaceRecord';
import type { AutoraceRacePlayerRecord } from '../../src/gateway/record/autoraceRacePlayerRecord';
import type { AutoraceRaceRecord } from '../../src/gateway/record/autoraceRaceRecord';
import type { BoatracePlaceRecord } from '../../src/gateway/record/boatracePlaceRecord';
import type { BoatraceRacePlayerRecord } from '../../src/gateway/record/boatraceRacePlayerRecord';
import type { BoatraceRaceRecord } from '../../src/gateway/record/boatraceRaceRecord';
import type { IRecord } from '../../src/gateway/record/iRecord';
import type { JraPlaceRecord } from '../../src/gateway/record/jraPlaceRecord';
import type { JraRaceRecord } from '../../src/gateway/record/jraRaceRecord';
import type { KeirinPlaceRecord } from '../../src/gateway/record/keirinPlaceRecord';
import type { KeirinRacePlayerRecord } from '../../src/gateway/record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../../src/gateway/record/keirinRaceRecord';
import type { NarPlaceRecord } from '../../src/gateway/record/narPlaceRecord';
import type { NarRaceRecord } from '../../src/gateway/record/narRaceRecord';
import type { WorldRaceRecord } from '../../src/gateway/record/worldRaceRecord';
import { allowedEnvs, ENV } from '../../src/utility/env';

const getS3Config = <T extends IRecord<T>>(
    bucketName: string,
    folderPath: string,
): IS3Gateway<T> => {
    switch (ENV) {
        case allowedEnvs.production: {
            return new S3Gateway<T>(bucketName, folderPath);
        }
        case allowedEnvs.test: {
            return new S3Gateway<T>(`test-${bucketName}`, folderPath);
        }
        case allowedEnvs.local:
        case allowedEnvs.localNoInitData:
        case allowedEnvs.localInitMadeData: {
            return new S3Gateway<T>(bucketName, folderPath);
        }
        case allowedEnvs.githubActionsCi: {
            return new MockS3Gateway<T>(bucketName, folderPath);
        }
        default: {
            throw new Error('Invalid ENV value');
        }
    }
};

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<KeirinPlaceRecord>>('KeirinPlaceS3Gateway', {
    useFactory: () =>
        getS3Config<KeirinPlaceRecord>('race-schedule-bucket', 'keirin/'),
});

container.register<IS3Gateway<KeirinRaceRecord>>('KeirinRaceS3Gateway', {
    useFactory: () =>
        getS3Config<KeirinRaceRecord>('race-schedule-bucket', 'keirin/'),
});

container.register<IS3Gateway<KeirinRacePlayerRecord>>(
    'KeirinRacePlayerS3Gateway',
    {
        useFactory: () =>
            getS3Config<KeirinRacePlayerRecord>(
                'race-schedule-bucket',
                'keirin/',
            ),
    },
);

container.register<IS3Gateway<NarRaceRecord>>('NarRaceS3Gateway', {
    useFactory: () =>
        getS3Config<NarRaceRecord>('race-schedule-bucket', 'nar/'),
});

container.register<IS3Gateway<NarPlaceRecord>>('NarPlaceS3Gateway', {
    useFactory: () =>
        getS3Config<NarPlaceRecord>('race-schedule-bucket', 'nar/'),
});

container.register<IS3Gateway<JraRaceRecord>>('JraRaceS3Gateway', {
    useFactory: () =>
        getS3Config<JraRaceRecord>('race-schedule-bucket', 'jra/'),
});

container.register<IS3Gateway<JraPlaceRecord>>('JraPlaceS3Gateway', {
    useFactory: () =>
        getS3Config<JraPlaceRecord>('race-schedule-bucket', 'jra/'),
});

container.register<IS3Gateway<WorldRaceRecord>>('WorldRaceS3Gateway', {
    useFactory: () =>
        getS3Config<WorldRaceRecord>('race-schedule-bucket', 'world/'),
});

container.register<IS3Gateway<AutoraceRaceRecord>>('AutoraceRaceS3Gateway', {
    useFactory: () =>
        getS3Config<AutoraceRaceRecord>('race-schedule-bucket', 'autorace/'),
});

container.register<IS3Gateway<AutoracePlaceRecord>>('AutoracePlaceS3Gateway', {
    useFactory: () =>
        getS3Config<AutoracePlaceRecord>('race-schedule-bucket', 'autorace/'),
});

container.register<IS3Gateway<AutoraceRacePlayerRecord>>(
    'AutoraceRacePlayerS3Gateway',
    {
        useFactory: () =>
            getS3Config<AutoraceRacePlayerRecord>(
                'race-schedule-bucket',
                'autorace/',
            ),
    },
);

container.register<IS3Gateway<BoatracePlaceRecord>>('BoatracePlaceS3Gateway', {
    useFactory: () =>
        getS3Config<BoatracePlaceRecord>('race-schedule-bucket', 'boatrace/'),
});

container.register<IS3Gateway<BoatraceRaceRecord>>('BoatraceRaceS3Gateway', {
    useFactory: () =>
        getS3Config<BoatraceRaceRecord>('race-schedule-bucket', 'boatrace/'),
});

container.register<IS3Gateway<BoatraceRacePlayerRecord>>(
    'BoatraceRacePlayerS3Gateway',
    {
        useFactory: () =>
            getS3Config<BoatraceRacePlayerRecord>(
                'race-schedule-bucket',
                'boatrace/',
            ),
    },
);
