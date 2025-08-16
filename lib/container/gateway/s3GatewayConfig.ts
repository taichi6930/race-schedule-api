import { container } from 'tsyringe';

import { S3Gateway } from '../../src/gateway/implement/s3Gateway';
import type { IS3Gateway } from '../../src/gateway/interface/iS3Gateway';
import { MockS3Gateway } from '../../src/gateway/mock/mockS3Gateway';
import type { heldDayRecord } from '../../src/gateway/record/heldDayRecord';
import type { HorseRacingRaceRecord } from '../../src/gateway/record/horseRacingRaceRecord';
import type { JraRaceRecord } from '../../src/gateway/record/jraRaceRecord';
import type { MechanicalRacingPlaceRecord } from '../../src/gateway/record/mechanicalRacingPlaceRecord';
import type { MechanicalRacingRaceRecord } from '../../src/gateway/record/mechanicalRacingRaceRecord';
import type { PlaceRecord } from '../../src/gateway/record/placeRecord';
import type { RacePlayerRecord } from '../../src/gateway/record/racePlayerRecord';
import { allowedEnvs, ENV } from '../../src/utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<MechanicalRacingPlaceRecord>>(
    'PlaceS3GatewayWithGrade',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new S3Gateway<MechanicalRacingPlaceRecord>(
                        process.env.S3_BUCKET_NAME ?? 'race-schedule-bucket',
                    );
                }
                case allowedEnvs.test: {
                    return new S3Gateway<MechanicalRacingPlaceRecord>(
                        process.env.S3_BUCKET_NAME ??
                            'race-schedule-bucket-test',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<MechanicalRacingPlaceRecord>(
                        process.env.S3_BUCKET_NAME ?? 'race-schedule-bucket',
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
    'MechanicalRacingRaceS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new S3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket',
                    );
                }
                case allowedEnvs.test: {
                    return new S3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket-test',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<MechanicalRacingRaceRecord>(
                        'race-schedule-bucket',
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
    'MechanicalRacingRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<RacePlayerRecord>(
                        'race-schedule-bucket',
                    );
                }
                case allowedEnvs.test: {
                    return new S3Gateway<RacePlayerRecord>(
                        'race-schedule-bucket-test',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<RacePlayerRecord>(
                        'race-schedule-bucket',
                    );
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);
container.register<IS3Gateway<HorseRacingRaceRecord>>(
    'HorseRacingRaceS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<HorseRacingRaceRecord>(
                        'race-schedule-bucket',
                    );
                }
                case allowedEnvs.test: {
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<HorseRacingRaceRecord>(
                        'race-schedule-bucket-test',
                    );
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.githubActionsCi: {
                    return new MockS3Gateway<HorseRacingRaceRecord>(
                        'race-schedule-bucket',
                    );
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);
container.register<IS3Gateway<JraRaceRecord>>('JraRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceRecord>('race-schedule-bucket');
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceRecord>(
                    'race-schedule-bucket-test',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
                return new MockS3Gateway<JraRaceRecord>('race-schedule-bucket');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<PlaceRecord>>('PlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<PlaceRecord>('race-schedule-bucket');
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<PlaceRecord>('race-schedule-bucket-test');
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
                return new MockS3Gateway<PlaceRecord>('race-schedule-bucket');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IS3Gateway<heldDayRecord>>('HeldDayS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new S3Gateway<heldDayRecord>('race-schedule-bucket');
            }
            case allowedEnvs.test: {
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<heldDayRecord>(
                    'race-schedule-bucket-test',
                );
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi: {
                return new MockS3Gateway<heldDayRecord>('race-schedule-bucket');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
