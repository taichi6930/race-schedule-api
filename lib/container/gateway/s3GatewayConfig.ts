import { container } from 'tsyringe';

import { S3Gateway } from '../../src/gateway/implement/s3Gateway';
import type { IS3Gateway } from '../../src/gateway/interface/iS3Gateway';
import { MockS3Gateway } from '../../src/gateway/mock/mockS3Gateway';
import type { HorseRacingRaceRecord } from '../../src/gateway/record/horseRacingRaceRecord';
import type { JraPlaceRecord } from '../../src/gateway/record/jraPlaceRecord';
import type { JraRaceRecord } from '../../src/gateway/record/jraRaceRecord';
import type { MechanicalRacingPlaceRecord } from '../../src/gateway/record/mechanicalRacingPlaceRecord';
import type { MechanicalRacingRaceRecord } from '../../src/gateway/record/mechanicalRacingRaceRecord';
import type { PlaceRecord } from '../../src/gateway/record/placeRecord';
import type { RacePlayerRecord } from '../../src/gateway/record/racePlayerRecord';
import type { WorldRaceRecord } from '../../src/gateway/record/worldRaceRecord';
import { allowedEnvs, ENV } from '../../src/utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<MechanicalRacingPlaceRecord>>('PlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<MechanicalRacingPlaceRecord>(
                    process.env.S3_BUCKET_NAME ?? 'race-schedule-bucket',
                    'common/',
                );
            }
            case allowedEnvs.test: {
                return new S3Gateway<MechanicalRacingPlaceRecord>(
                    process.env.S3_BUCKET_NAME ?? 'race-schedule-bucket-test',
                    'common/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
                return new MockS3Gateway<MechanicalRacingPlaceRecord>(
                    process.env.S3_BUCKET_NAME ?? 'race-schedule-bucket',
                    'common/',
                );
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<MechanicalRacingPlaceRecord>>(
    'KeirinPlaceS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new S3Gateway<MechanicalRacingPlaceRecord>(
                        process.env.S3_BUCKET_NAME ?? 'race-schedule-bucket',
                        'keirin/',
                    );
                }
                case allowedEnvs.test: {
                    return new S3Gateway<MechanicalRacingPlaceRecord>(
                        process.env.S3_BUCKET_NAME ??
                            'race-schedule-bucket-test',
                        'keirin/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<MechanicalRacingPlaceRecord>(
                        process.env.S3_BUCKET_NAME ?? 'race-schedule-bucket',
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
container.register<IS3Gateway<MechanicalRacingRaceRecord>>(
    'KeirinRaceS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new S3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket',
                        'keirin/',
                    );
                }
                case allowedEnvs.test: {
                    return new S3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket-test',
                        'keirin/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<MechanicalRacingRaceRecord>(
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
container.register<IS3Gateway<RacePlayerRecord>>('KeirinRacePlayerS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<RacePlayerRecord>(
                    'race-schedule-bucket',
                    'keirin/',
                );
            }
            case allowedEnvs.test: {
                return new S3Gateway<RacePlayerRecord>(
                    'race-schedule-bucket-test',
                    'keirin/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
                return new MockS3Gateway<RacePlayerRecord>(
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

container.register<IS3Gateway<HorseRacingRaceRecord>>('NarRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<HorseRacingRaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<HorseRacingRaceRecord>(
                    'race-schedule-bucket-test',
                    'nar/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
                return new MockS3Gateway<HorseRacingRaceRecord>(
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
container.register<IS3Gateway<PlaceRecord>>('NarPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<PlaceRecord>(
                    'race-schedule-bucket',
                    'nar/',
                );
            }
            case allowedEnvs.test: {
                return new S3Gateway<PlaceRecord>(
                    'race-schedule-bucket-test',
                    'nar/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
                return new MockS3Gateway<PlaceRecord>(
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
                    'race-schedule-bucket-test',
                    'jra/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
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
                    'race-schedule-bucket-test',
                    'jra/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
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
                    'race-schedule-bucket-test',
                    'world/',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
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

container.register<IS3Gateway<MechanicalRacingRaceRecord>>(
    'AutoraceRaceS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket',
                        'autorace/',
                    );
                }
                case allowedEnvs.test: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket-test',
                        'autorace/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<MechanicalRacingRaceRecord>(
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
container.register<IS3Gateway<MechanicalRacingPlaceRecord>>(
    'AutoracePlaceS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new S3Gateway<MechanicalRacingPlaceRecord>(
                        'race-schedule-bucket',
                        'autorace/',
                    );
                }
                case allowedEnvs.test: {
                    return new S3Gateway<MechanicalRacingPlaceRecord>(
                        'race-schedule-bucket-test',
                        'autorace/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<MechanicalRacingPlaceRecord>(
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
container.register<IS3Gateway<RacePlayerRecord>>(
    'AutoraceRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<RacePlayerRecord>(
                        'race-schedule-bucket',
                        'autorace/',
                    );
                }
                case allowedEnvs.test: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<RacePlayerRecord>(
                        'race-schedule-bucket-test',
                        'autorace/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<RacePlayerRecord>(
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
container.register<IS3Gateway<MechanicalRacingPlaceRecord>>(
    'BoatracePlaceS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new S3Gateway<MechanicalRacingPlaceRecord>(
                        'race-schedule-bucket',
                        'boatrace/',
                    );
                }
                case allowedEnvs.test: {
                    return new S3Gateway<MechanicalRacingPlaceRecord>(
                        'race-schedule-bucket-test',
                        'boatrace/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<MechanicalRacingPlaceRecord>(
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
container.register<IS3Gateway<MechanicalRacingRaceRecord>>(
    'BoatraceRaceS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket',
                        'boatrace/',
                    );
                }
                case allowedEnvs.test: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket-test',
                        'boatrace/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<MechanicalRacingRaceRecord>(
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
container.register<IS3Gateway<RacePlayerRecord>>(
    'BoatraceRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<RacePlayerRecord>(
                        'race-schedule-bucket',
                        'boatrace/',
                    );
                }
                case allowedEnvs.test: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<RacePlayerRecord>(
                        'race-schedule-bucket-test',
                        'boatrace/',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<RacePlayerRecord>(
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
