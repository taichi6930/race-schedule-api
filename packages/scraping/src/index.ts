import 'reflect-metadata';

import type { CloudFlareEnv } from '@race-schedule/shared/src/utilities/cloudFlareEnv';
import { EnvStore } from '@race-schedule/shared/src/utilities/envStore';

import { router } from './router';

export default {
    async fetch(request: Request, env: CloudFlareEnv): Promise<Response> {
        EnvStore.setEnv(env);
        return router(request);
    },
};
