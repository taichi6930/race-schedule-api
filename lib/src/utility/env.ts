

import * as dotenv from 'dotenv';


dotenv.config();


export const allowedEnvs = {
    production: 'PRODUCTION',
    test: 'TEST',
    local: 'LOCAL',
    localNoInitData: 'LOCAL_NO_INIT_DATA',
    localInitMadeData: 'LOCAL_INIT_MADE_DATA',
    githubActionsCi: 'GITHUB_ACTIONS_CI',
} as const;


export type EnvType = (typeof allowedEnvs)[keyof typeof allowedEnvs];


const getEnv = (env: string | undefined): EnvType => {
    if (!Object.values(allowedEnvs).includes(env as EnvType)) {
        throw new Error(
            `Invalid ENV value: ${env ?? 'undefined'}. Allowed values are: ${Object.values(allowedEnvs).join(', ')}`,
        );
    }
    return env as EnvType;
};


export const ENV = getEnv(process.env.ENV);
