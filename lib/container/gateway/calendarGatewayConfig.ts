import { container } from 'tsyringe';

import { GoogleCalendarGateway } from '../../src/gateway/implement/googleCalendarGateway';
import type { ICalendarGateway } from '../../src/gateway/interface/iCalendarGateway';
import { MockGoogleCalendarGateway } from '../../src/gateway/mock/mockGoogleCalendarGateway';
import { allowedEnvs, ENV } from '../../src/utility/env';

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
