import { container } from 'tsyringe';

import { OldGoogleCalendarGateway } from '../../src/gateway/implement/googleCalendarGateway';
import type { IOldCalendarGateway } from '../../src/gateway/interface/iCalendarGateway';
import { MockOldGoogleCalendarGateway } from '../../src/gateway/mock/mockGoogleCalendarGateway';
import { allowedEnvs, ENV } from '../../src/utility/env';
import { RaceType } from '../../src/utility/raceType';

container.register<IOldCalendarGateway>('JraGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                return new OldGoogleCalendarGateway(
                    process.env.JRA_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new OldGoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockOldGoogleCalendarGateway(RaceType.JRA);
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
                return new OldGoogleCalendarGateway(
                    process.env.NAR_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new OldGoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockOldGoogleCalendarGateway(RaceType.NAR);
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
                return new OldGoogleCalendarGateway(
                    process.env.KEIRIN_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new OldGoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockOldGoogleCalendarGateway(RaceType.KEIRIN);
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
                return new OldGoogleCalendarGateway(
                    process.env.BOATRACE_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new OldGoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockOldGoogleCalendarGateway(RaceType.BOATRACE);
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
                return new OldGoogleCalendarGateway(
                    process.env.AUTORACE_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new OldGoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockOldGoogleCalendarGateway(RaceType.AUTORACE);
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
                return new OldGoogleCalendarGateway(
                    process.env.WORLD_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.test: {
                return new OldGoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            }
            case allowedEnvs.localNoInitData:
            case allowedEnvs.localInitMadeData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                return new MockOldGoogleCalendarGateway(RaceType.WORLD);
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    },
});
