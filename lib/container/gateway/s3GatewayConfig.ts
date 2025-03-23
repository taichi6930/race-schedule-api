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
import type { JraPlaceRecord } from '../../src/gateway/record/jraPlaceRecord';
import type { JraRaceRecord } from '../../src/gateway/record/jraRaceRecord';
import type { KeirinPlaceRecord } from '../../src/gateway/record/keirinPlaceRecord';
import type { KeirinRacePlayerRecord } from '../../src/gateway/record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../../src/gateway/record/keirinRaceRecord';
import type { NarPlaceRecord } from '../../src/gateway/record/narPlaceRecord';
import type { NarRaceRecord } from '../../src/gateway/record/narRaceRecord';
import type { WorldRaceRecord } from '../../src/gateway/record/worldRaceRecord';
import { allowedEnvs, ENV } from '../../src/utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<KeirinPlaceRecord>>('KeirinPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<KeirinPlaceRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            }
            case allowedEnvs.test: {
                return new S3Gateway<KeirinPlaceRecord>(
                    'test-race-schedule-bucket',
                    'keirin/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<KeirinPlaceRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<KeirinRaceRecord>>('KeirinRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<KeirinRaceRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            }
            case allowedEnvs.test: {
                return new S3Gateway<KeirinRaceRecord>(
                    'test-race-schedule-bucket',
                    'keirin/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<KeirinRaceRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<KeirinRacePlayerRecord>>(
    'KeirinRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<KeirinRacePlayerRecord>(
                        'race-schedule-bucket',
                        'keirin/',
                    );
                }
                case allowedEnvs.test: {
                    return new S3Gateway<KeirinRacePlayerRecord>(
                        'test-race-schedule-bucket',
                        'keirin/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData: {
                    return new MockS3Gateway<KeirinRacePlayerRecord>(
                        'race-schedule-bucket',
                        'keirin/',
                    );
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);

container.register<IS3Gateway<NarRaceRecord>>('NarRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceRecord>(
                    'test-race-schedule-bucket',
                    'nar/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<NarRaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<NarPlaceRecord>>('NarPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<NarPlaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            }
            case allowedEnvs.test: {
                return new S3Gateway<NarPlaceRecord>(
                    'test-race-schedule-bucket',
                    'nar/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<NarPlaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<JraRaceRecord>>('JraRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceRecord>(
                    'race-schedule-bucket',
                    'jra/',
                );
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceRecord>(
                    'test-race-schedule-bucket',
                    'jra/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<JraRaceRecord>(
                    'race-schedule-bucket',
                    'jra/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<JraPlaceRecord>>('JraPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<JraPlaceRecord>(
                    'race-schedule-bucket',
                    'jra/',
                );
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraPlaceRecord>(
                    'test-race-schedule-bucket',
                    'jra/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<JraPlaceRecord>(
                    'race-schedule-bucket',
                    'jra/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<WorldRaceRecord>>('WorldRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<WorldRaceRecord>(
                    'race-schedule-bucket',
                    'world/',
                );
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<WorldRaceRecord>(
                    'test-race-schedule-bucket',
                    'world/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<WorldRaceRecord>(
                    'race-schedule-bucket',
                    'world/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IS3Gateway<AutoraceRaceRecord>>('AutoraceRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<AutoraceRaceRecord>(
                    'race-schedule-bucket',
                    'autorace/',
                );
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<AutoraceRaceRecord>(
                    'test-race-schedule-bucket',
                    'autorace/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<AutoraceRaceRecord>(
                    'race-schedule-bucket',
                    'autorace/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<AutoracePlaceRecord>>('AutoracePlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<AutoracePlaceRecord>(
                    'race-schedule-bucket',
                    'autorace/',
                );
            }
            case allowedEnvs.test: {
                return new S3Gateway<AutoracePlaceRecord>(
                    'test-race-schedule-bucket',
                    'autorace/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<AutoracePlaceRecord>(
                    'race-schedule-bucket',
                    'autorace/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<AutoraceRacePlayerRecord>>(
    'AutoraceRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<AutoraceRacePlayerRecord>(
                        'race-schedule-bucket',
                        'autorace/',
                    );
                }
                case allowedEnvs.test: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<AutoraceRacePlayerRecord>(
                        'test-race-schedule-bucket',
                        'autorace/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData: {
                    return new MockS3Gateway<AutoraceRacePlayerRecord>(
                        'race-schedule-bucket',
                        'autorace/',
                    );
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);
container.register<IS3Gateway<BoatracePlaceRecord>>('BoatracePlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<BoatracePlaceRecord>(
                    'race-schedule-bucket',
                    'boatrace/',
                );
            }
            case allowedEnvs.test: {
                return new S3Gateway<BoatracePlaceRecord>(
                    'test-race-schedule-bucket',
                    'boatrace/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<BoatracePlaceRecord>(
                    'race-schedule-bucket',
                    'boatrace/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<BoatraceRaceRecord>>('BoatraceRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<BoatraceRaceRecord>(
                    'race-schedule-bucket',
                    'boatrace/',
                );
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<BoatraceRaceRecord>(
                    'test-race-schedule-bucket',
                    'boatrace/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData: {
                return new MockS3Gateway<BoatraceRaceRecord>(
                    'race-schedule-bucket',
                    'boatrace/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<BoatraceRacePlayerRecord>>(
    'BoatraceRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<BoatraceRacePlayerRecord>(
                        'race-schedule-bucket',
                        'boatrace/',
                    );
                }
                case allowedEnvs.test: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<BoatraceRacePlayerRecord>(
                        'test-race-schedule-bucket',
                        'boatrace/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData: {
                    return new MockS3Gateway<BoatraceRacePlayerRecord>(
                        'race-schedule-bucket',
                        'boatrace/',
                    );
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);
