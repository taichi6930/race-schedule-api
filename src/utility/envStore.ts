import type { CloudFlareEnv } from './cloudFlareEnv';

let _env: CloudFlareEnv | undefined;

export const EnvStore = {
    setEnv(env: CloudFlareEnv): void {
        _env = env;
    },
    get env(): CloudFlareEnv {
        if (_env === undefined) {
            throw new TypeError('EnvStore.env is not set');
        }
        return _env;
    },
};
