import { container } from 'tsyringe';

import { AutoraceRaceDataHtmlGateway } from '../../src/gateway/implement/autoraceRaceDataHtmlGateway';
import { BoatracePlaceDataHtmlGateway } from '../../src/gateway/implement/boatracePlaceDataHtmlGateway';
import { BoatraceRaceDataHtmlGateway } from '../../src/gateway/implement/boatraceRaceDataHtmlGateway';
import { JraRaceDataHtmlGateway } from '../../src/gateway/implement/jraRaceDataHtmlGateway';
import { PlaceDataHtmlGateway } from '../../src/gateway/implement/placeDataHtmlGateway';
import { RaceDataHtmlGateway } from '../../src/gateway/implement/raceDataHtmlGateway';
import { WorldRaceDataHtmlGateway } from '../../src/gateway/implement/worldRaceDataHtmlGateway';
import type { IAutoraceRaceDataHtmlGateway } from '../../src/gateway/interface/iAutoraceRaceDataHtmlGateway';
import type { IBoatracePlaceDataHtmlGateway } from '../../src/gateway/interface/iBoatracePlaceDataHtmlGateway';
import type { IBoatraceRaceDataHtmlGateway } from '../../src/gateway/interface/iBoatraceRaceDataHtmlGateway';
import type { IJraRaceDataHtmlGateway } from '../../src/gateway/interface/iJraRaceDataHtmlGateway';
import type { IPlaceDataHtmlGateway } from '../../src/gateway/interface/iPlaceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from '../../src/gateway/interface/iRaceDataHtmlGateway';
import type { IWorldRaceDataHtmlGateway } from '../../src/gateway/interface/iWorldRaceDataHtmlGateway';
import { MockAutoraceRaceDataHtmlGateway } from '../../src/gateway/mock/mockAutoraceRaceDataHtmlGateway';
import { MockBoatracePlaceDataHtmlGateway } from '../../src/gateway/mock/mockBoatracePlaceDataHtmlGateway';
import { MockBoatraceRaceDataHtmlGateway } from '../../src/gateway/mock/mockBoatraceRaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../../src/gateway/mock/mockJraRaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../src/gateway/mock/mockPlaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../src/gateway/mock/mockRaceDataHtmlGateway';
import { MockWorldRaceDataHtmlGateway } from '../../src/gateway/mock/mockWorldRaceDataHtmlGateway';
import { allowedEnvs, ENV } from '../../src/utility/env';

// s3Gatewayの実装クラスをDIコンテナに登錄する

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
