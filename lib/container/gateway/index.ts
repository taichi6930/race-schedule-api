import { container } from 'tsyringe';

import { RaceDataHtmlGateway } from '../../../src/gateway/implement/raceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from '../../../src/gateway/interface/iRaceDataHtmlGateway';
import { GoogleCalendarGatewayForAWS } from '../../src/gateway/implement/googleCalendarGateway';
import { PlaceDataHtmlGatewayForAWS } from '../../src/gateway/implement/placeDataHtmlGateway';
import { S3Gateway } from '../../src/gateway/implement/s3Gateway';
import type { ICalendarGatewayForAWS } from '../../src/gateway/interface/iCalendarGateway';
import type { IPlaceDataHtmlGatewayForAWS } from '../../src/gateway/interface/iPlaceDataHtmlGateway';
import type { IS3Gateway } from '../../src/gateway/interface/iS3Gateway';
import { MockGoogleCalendarGateway } from '../../src/gateway/mock/mockGoogleCalendarGateway';
import { MockPlaceDataHtmlGateway } from '../../src/gateway/mock/mockPlaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../src/gateway/mock/mockRaceDataHtmlGateway';
import { MockS3Gateway } from '../../src/gateway/mock/mockS3Gateway';
import { allowedEnvs, ENV } from '../../src/utility/env';

container.register<ICalendarGatewayForAWS>('GoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new GoogleCalendarGatewayForAWS();
            }
            case allowedEnvs.test: {
                return new GoogleCalendarGatewayForAWS();
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

container.register<IPlaceDataHtmlGatewayForAWS>('PlaceDataHtmlGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new PlaceDataHtmlGatewayForAWS();
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
