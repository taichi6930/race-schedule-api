import { container } from 'tsyringe';

import { BoatraceRaceDataHtmlGateway } from '../../src/gateway/implement/boatraceRaceDataHtmlGateway';
import { PlaceDataHtmlGateway } from '../../src/gateway/implement/placeDataHtmlGateway';
import { RaceDataHtmlGateway } from '../../src/gateway/implement/raceDataHtmlGateway';
import type { IBoatraceRaceDataHtmlGateway } from '../../src/gateway/interface/iBoatraceRaceDataHtmlGateway';
import type { IPlaceDataHtmlGateway } from '../../src/gateway/interface/iPlaceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from '../../src/gateway/interface/iRaceDataHtmlGateway';
import { MockBoatraceRaceDataHtmlGateway } from '../../src/gateway/mock/mockBoatraceRaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../src/gateway/mock/mockPlaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../src/gateway/mock/mockRaceDataHtmlGateway';
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
