import { container } from 'tsyringe';

import { AutoracePlaceDataHtmlGateway } from '../../src/gateway/implement/autoracePlaceDataHtmlGateway';
import { AutoraceRaceDataHtmlGateway } from '../../src/gateway/implement/autoraceRaceDataHtmlGateway';
import { BoatracePlaceDataHtmlGateway } from '../../src/gateway/implement/boatracePlaceDataHtmlGateway';
import { BoatraceRaceDataHtmlGateway } from '../../src/gateway/implement/boatraceRaceDataHtmlGateway';
import { JraPlaceDataHtmlGateway } from '../../src/gateway/implement/jraPlaceDataHtmlGateway';
import { JraRaceDataHtmlGateway } from '../../src/gateway/implement/jraRaceDataHtmlGateway';
import { KeirinPlaceDataHtmlGateway } from '../../src/gateway/implement/keirinPlaceDataHtmlGateway';
import { KeirinRaceDataHtmlGateway } from '../../src/gateway/implement/keirinRaceDataHtmlGateway';
import { NarPlaceDataHtmlGateway } from '../../src/gateway/implement/narPlaceDataHtmlGateway';
import { NarRaceDataHtmlGateway } from '../../src/gateway/implement/narRaceDataHtmlGateway';
import { WorldRaceDataHtmlGateway } from '../../src/gateway/implement/worldRaceDataHtmlGateway';
import type { IAutoracePlaceDataHtmlGateway } from '../../src/gateway/interface/iAutoracePlaceDataHtmlGateway';
import type { IAutoraceRaceDataHtmlGateway } from '../../src/gateway/interface/iAutoraceRaceDataHtmlGateway';
import type { IBoatracePlaceDataHtmlGateway } from '../../src/gateway/interface/iBoatracePlaceDataHtmlGateway';
import type { IBoatraceRaceDataHtmlGateway } from '../../src/gateway/interface/iBoatraceRaceDataHtmlGateway';
import type { IJraPlaceDataHtmlGateway } from '../../src/gateway/interface/iJraPlaceDataHtmlGateway';
import type { IJraRaceDataHtmlGateway } from '../../src/gateway/interface/iJraRaceDataHtmlGateway';
import type { IKeirinPlaceDataHtmlGateway } from '../../src/gateway/interface/iKeirinPlaceDataHtmlGateway';
import type { IKeirinRaceDataHtmlGateway } from '../../src/gateway/interface/iKeirinRaceDataHtmlGateway';
import type { INarPlaceDataHtmlGateway } from '../../src/gateway/interface/iNarPlaceDataHtmlGateway';
import type { INarRaceDataHtmlGateway } from '../../src/gateway/interface/iNarRaceDataHtmlGateway';
import type { IWorldRaceDataHtmlGateway } from '../../src/gateway/interface/iWorldRaceDataHtmlGateway';
import { MockAutoracePlaceDataHtmlGateway } from '../../src/gateway/mock/mockAutoracePlaceDataHtmlGateway';
import { MockAutoraceRaceDataHtmlGateway } from '../../src/gateway/mock/mockAutoraceRaceDataHtmlGateway';
import { MockBoatracePlaceDataHtmlGateway } from '../../src/gateway/mock/mockBoatracePlaceDataHtmlGateway';
import { MockBoatraceRaceDataHtmlGateway } from '../../src/gateway/mock/mockBoatraceRaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../../src/gateway/mock/mockJraPlaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../../src/gateway/mock/mockJraRaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../../src/gateway/mock/mockKeirinPlaceDataHtmlGateway';
import { MockKeirinRaceDataHtmlGateway } from '../../src/gateway/mock/mockKeirinRaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../../src/gateway/mock/mockNarPlaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../../src/gateway/mock/mockNarRaceDataHtmlGateway';
import { MockWorldRaceDataHtmlGateway } from '../../src/gateway/mock/mockWorldRaceDataHtmlGateway';
import { allowedEnvs, ENV } from '../../src/utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する

container.register<IKeirinPlaceDataHtmlGateway>('KeirinPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new KeirinPlaceDataHtmlGateway();
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockKeirinPlaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IKeirinRaceDataHtmlGateway>('KeirinRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new KeirinRaceDataHtmlGateway();
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockKeirinRaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<INarRaceDataHtmlGateway>('NarRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new NarRaceDataHtmlGateway();
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockNarRaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<INarPlaceDataHtmlGateway>('NarPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new NarPlaceDataHtmlGateway();
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockNarPlaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IJraRaceDataHtmlGateway>('JraRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new JraRaceDataHtmlGateway();
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockJraRaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
container.register<IJraPlaceDataHtmlGateway>('JraPlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production:
            case allowedEnvs.local: {
                return new JraPlaceDataHtmlGateway();
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockJraPlaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IWorldRaceDataHtmlGateway>('WorldRaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new WorldRaceDataHtmlGateway();
            }
            case allowedEnvs.local:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.test:
            case allowedEnvs.githubActionsCi: {
                return new MockWorldRaceDataHtmlGateway();
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IAutoracePlaceDataHtmlGateway>(
    'AutoracePlaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new AutoracePlaceDataHtmlGateway();
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.test:
                case allowedEnvs.githubActionsCi: {
                    return new MockAutoracePlaceDataHtmlGateway();
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);
container.register<IAutoraceRaceDataHtmlGateway>(
    'AutoraceRaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new AutoraceRaceDataHtmlGateway();
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.test:
                case allowedEnvs.githubActionsCi: {
                    return new MockAutoraceRaceDataHtmlGateway();
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);

container.register<IBoatracePlaceDataHtmlGateway>(
    'BoatracePlaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new BoatracePlaceDataHtmlGateway();
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.test:
                case allowedEnvs.githubActionsCi: {
                    return new MockBoatracePlaceDataHtmlGateway();
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);
container.register<IBoatraceRaceDataHtmlGateway>(
    'BoatraceRaceDataHtmlGateway',
    {
        useFactory: () => {
            switch (ENV) {
                case allowedEnvs.production: {
                    return new BoatraceRaceDataHtmlGateway();
                }
                case allowedEnvs.local:
                case allowedEnvs.localNoInitData:
                case allowedEnvs.localInitMadeData:
                case allowedEnvs.test:
                case allowedEnvs.githubActionsCi: {
                    return new MockBoatraceRaceDataHtmlGateway();
                }
                default: {
                    throw new Error('Invalid ENV value');
                }
            }
        },
    },
);
