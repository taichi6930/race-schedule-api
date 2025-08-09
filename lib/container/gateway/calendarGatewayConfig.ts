import { container } from 'tsyringe';

import { GoogleCalendarGateway } from '../../src/gateway/implement/googleCalendarGateway';
import type { IOldCalendarGateway } from '../../src/gateway/interface/iCalendarGateway';
import { MockGoogleCalendarGateway } from '../../src/gateway/mock/mockGoogleCalendarGateway';
import { allowedEnvs, ENV } from '../../src/utility/env';

container.register<IOldCalendarGateway>('JraGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new GoogleCalendarGateway(
                    process.env.JRA_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockGoogleCalendarGateway('jra');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IOldCalendarGateway>('NarGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new GoogleCalendarGateway(
                    process.env.NAR_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockGoogleCalendarGateway('nar');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

// Keirin
container.register<IOldCalendarGateway>('KeirinGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new GoogleCalendarGateway(
                    process.env.KEIRIN_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockGoogleCalendarGateway('keirin');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IOldCalendarGateway>('BoatraceGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new GoogleCalendarGateway(
                    process.env.BOATRACE_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockGoogleCalendarGateway('boatrace');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IOldCalendarGateway>('AutoraceGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new GoogleCalendarGateway(
                    process.env.AUTORACE_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockGoogleCalendarGateway('autorace');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});

container.register<IOldCalendarGateway>('WorldGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new GoogleCalendarGateway(
                    process.env.WORLD_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockGoogleCalendarGateway('world');
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
