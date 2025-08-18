import { container } from 'tsyringe';

import { S3Gateway } from '../../src/gateway/implement/s3Gateway';
import type { IS3Gateway } from '../../src/gateway/interface/iS3Gateway';
import { MockS3Gateway } from '../../src/gateway/mock/mockS3Gateway';
import { allowedEnvs, ENV } from '../../src/utility/env';


container.register<IS3Gateway>('S3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                
                return new S3Gateway('race-schedule-bucket');
            }
            case allowedEnvs.test: {
                
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

container.register<IS3Gateway>('MechanicalRacingRacePlayerS3Gateway', {
    useFactory: () => {
        switch (ENV) {
            case allowedEnvs.production: {
                
                return new S3Gateway('race-schedule-bucket');
            }
            case allowedEnvs.test: {
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
