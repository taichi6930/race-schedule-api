/// <reference types="@cloudflare/workers-types" />
import 'reflect-metadata';

import type { CloudFlareEnv } from '@race-schedule/shared/src/utilities/cloudFlareEnv';
import { EnvStore } from '@race-schedule/shared/src/utilities/envStore';

import { router } from './router';

export default {
    async fetch(request: Request, env: CloudFlareEnv): Promise<Response> {
        // 環境変数をEnvStoreに設定
        EnvStore.setEnv(env);
        return router(request);
    },
};
