import { container } from 'tsyringe';

import { AutoracePlaceDataHtmlGateway } from '../src/gateway/implement/autoracePlaceDataHtmlGateway';
import { AutoraceRaceDataHtmlGateway } from '../src/gateway/implement/autoraceRaceDataHtmlGateway';
import { JraPlaceDataHtmlGateway } from '../src/gateway/implement/jraPlaceDataHtmlGateway';
import { JraRaceDataHtmlGateway } from '../src/gateway/implement/jraRaceDataHtmlGateway';
import { KeirinPlaceDataHtmlGateway } from '../src/gateway/implement/keirinPlaceDataHtmlGateway';
import { KeirinRaceDataHtmlGateway } from '../src/gateway/implement/keirinRaceDataHtmlGateway';
import { NarPlaceDataHtmlGateway } from '../src/gateway/implement/narPlaceDataHtmlGateway';
import { NarRaceDataHtmlGateway } from '../src/gateway/implement/narRaceDataHtmlGateway';
import { S3Gateway } from '../src/gateway/implement/s3Gateway';
import { WorldRaceDataHtmlGateway } from '../src/gateway/implement/worldRaceDataHtmlGateway';
import type { IAutoracePlaceDataHtmlGateway } from '../src/gateway/interface/iAutoracePlaceDataHtmlGateway';
import type { IAutoraceRaceDataHtmlGateway } from '../src/gateway/interface/iAutoraceRaceDataHtmlGateway';
import type { IJraPlaceDataHtmlGateway } from '../src/gateway/interface/iJraPlaceDataHtmlGateway';
import type { IJraRaceDataHtmlGateway } from '../src/gateway/interface/iJraRaceDataHtmlGateway';
import type { IKeirinPlaceDataHtmlGateway } from '../src/gateway/interface/iKeirinPlaceDataHtmlGateway';
import type { IKeirinRaceDataHtmlGateway } from '../src/gateway/interface/iKeirinRaceDataHtmlGateway';
import type { INarPlaceDataHtmlGateway } from '../src/gateway/interface/iNarPlaceDataHtmlGateway';
import type { INarRaceDataHtmlGateway } from '../src/gateway/interface/iNarRaceDataHtmlGateway';
import type { IS3Gateway } from '../src/gateway/interface/iS3Gateway';
import type { IWorldRaceDataHtmlGateway } from '../src/gateway/interface/iWorldRaceDataHtmlGateway';
import { MockAutoracePlaceDataHtmlGateway } from '../src/gateway/mock/mockAutoracePlaceDataHtmlGateway';
import { MockAutoraceRaceDataHtmlGateway } from '../src/gateway/mock/mockAutoraceRaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../src/gateway/mock/mockJraPlaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../src/gateway/mock/mockJraRaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../src/gateway/mock/mockKeirinPlaceDataHtmlGateway';
import { MockKeirinRaceDataHtmlGateway } from '../src/gateway/mock/mockKeirinRaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../src/gateway/mock/mockNarPlaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../src/gateway/mock/mockNarRaceDataHtmlGateway';
import { MockS3Gateway } from '../src/gateway/mock/mockS3Gateway';
import { MockWorldRaceDataHtmlGateway } from '../src/gateway/mock/mockWorldRaceDataHtmlGateway';
import type { KeirinPlaceRecord } from '../src/gateway/record/keirinPlaceRecord';
import type { KeirinRacePlayerRecord } from '../src/gateway/record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../src/gateway/record/keirinRaceRecord';
import type { AutoracePlaceEntity } from '../src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../src/repository/entity/autoraceRaceEntity';
import type { JraPlaceEntity } from '../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../src/repository/entity/jraRaceEntity';
import type { NarPlaceEntity } from '../src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../src/repository/entity/worldRaceEntity';
import { ENV } from '../src/utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する
container.register<IS3Gateway<KeirinPlaceRecord>>('KeirinPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<KeirinPlaceRecord>(
                    'race-schedule-bucket',
                    'keirin/place/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<KeirinPlaceRecord>(
                    'race-schedule-bucket',
                    'keirin/place/',
                );
        }
    },
});
container.register<IS3Gateway<NarRaceEntity>>('NarRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<NarRaceEntity>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<NarRaceEntity>(
                    'race-schedule-bucket',
                    'nar/race/',
                );
        }
    },
});
container.register<IS3Gateway<KeirinRaceRecord>>('KeirinRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<KeirinRaceRecord>(
                    'race-schedule-bucket',
                    'keirin/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<KeirinRaceRecord>(
                    'race-schedule-bucket',
                    'keirin/race/',
                );
        }
    },
});
container.register<IS3Gateway<KeirinRacePlayerRecord>>(
    'KeirinRacePlayerS3Gateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、S3Gateway を使用
                    return new S3Gateway<KeirinRacePlayerRecord>(
                        'race-schedule-bucket',
                        'keirin/raceplayer/',
                    );
                case 'ITa':
                case 'LOCAL':
                default:
                    return new MockS3Gateway<KeirinRacePlayerRecord>(
                        'race-schedule-bucket',
                        'keirin/raceplayer/',
                    );
            }
        },
    },
);
container.register<IS3Gateway<WorldRaceEntity>>('WorldRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<WorldRaceEntity>(
                    'race-schedule-bucket',
                    'world/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<WorldRaceEntity>(
                    'race-schedule-bucket',
                    'world/race/',
                );
        }
    },
});
container.register<IS3Gateway<AutoraceRaceEntity>>('AutoraceRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<AutoraceRaceEntity>(
                    'race-schedule-bucket',
                    'autorace/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<AutoraceRaceEntity>(
                    'race-schedule-bucket',
                    'autorace/race/',
                );
        }
    },
});
container.register<IS3Gateway<JraRaceEntity>>('JraRaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、S3Gateway を使用
                return new S3Gateway<JraRaceEntity>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<JraRaceEntity>(
                    'race-schedule-bucket',
                    'jra/race/',
                );
        }
    },
});
container.register<IS3Gateway<NarPlaceEntity>>('NarPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<NarPlaceEntity>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<NarPlaceEntity>(
                    'race-schedule-bucket',
                    'nar/place/',
                );
        }
    },
});
container.register<IS3Gateway<JraPlaceEntity>>('JraPlaceS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new S3Gateway<JraPlaceEntity>(
                    'race-schedule-bucket',
                    'jra/place/',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockS3Gateway<JraPlaceEntity>(
                    'race-schedule-bucket',
                    'jra/place/',
                );
        }
    },
});
container.register<INarRaceDataHtmlGateway>('NarRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                console.log('NarRaceDataHtmlGateway');
                return new NarRaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockNarRaceDataHtmlGateway();
        }
    },
});
container.register<IJraRaceDataHtmlGateway>('JraRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                console.log('JraRaceDataHtmlGateway');
                return new JraRaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockJraRaceDataHtmlGateway();
        }
    },
});
container.register<INarPlaceDataHtmlGateway>('NarPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new NarPlaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockNarPlaceDataHtmlGateway();
        }
    },
});
container.register<IJraPlaceDataHtmlGateway>('JraPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new JraPlaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockJraPlaceDataHtmlGateway();
        }
    },
});

container.register<IKeirinPlaceDataHtmlGateway>('KeirinPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new KeirinPlaceDataHtmlGateway();
            default:
                return new MockKeirinPlaceDataHtmlGateway();
        }
    },
});

container.register<IKeirinRaceDataHtmlGateway>('KeirinRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new KeirinRaceDataHtmlGateway();
            default:
                return new MockKeirinRaceDataHtmlGateway();
        }
    },
});

container.register<IAutoraceRaceDataHtmlGateway>(
    'AutoraceRaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    return new AutoraceRaceDataHtmlGateway();
                default:
                    return new MockAutoraceRaceDataHtmlGateway();
            }
        },
    },
);

container.register<IWorldRaceDataHtmlGateway>('WorldRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                console.log('WorldRaceDataHtmlGateway');
                return new WorldRaceDataHtmlGateway();
            case 'ITa':
            case 'LOCAL':
            default:
                return new MockWorldRaceDataHtmlGateway();
        }
    },
});

container.register<IS3Gateway<AutoracePlaceEntity>>(
    'AutoracePlaceStorageGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    return new S3Gateway<AutoracePlaceEntity>(
                        'race-schedule-bucket',
                        'autorace/place/',
                    );
                case 'ITa':
                case 'LOCAL':
                default:
                    return new MockS3Gateway<AutoracePlaceEntity>(
                        'race-schedule-bucket',
                        'autorace/place/',
                    );
            }
        },
    },
);

container.register<IAutoracePlaceDataHtmlGateway>(
    'AutoracePlaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    console.log('AutoracePlaceDataHtmlGateway');
                    return new AutoracePlaceDataHtmlGateway();
                case 'ITa':
                case 'LOCAL':
                default:
                    return new MockAutoracePlaceDataHtmlGateway();
            }
        },
    },
);

container.register<IAutoraceRaceDataHtmlGateway>(
    'AutoraceRaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    console.log('AutoraceRaceDataHtmlGateway');
                    return new AutoraceRaceDataHtmlGateway();
                case 'ITa':
                case 'LOCAL':
                default:
                    return new MockAutoraceRaceDataHtmlGateway();
            }
        },
    },
);