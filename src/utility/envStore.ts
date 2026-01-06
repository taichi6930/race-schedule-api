import type { OldCloudFlareEnv } from './cloudFlareEnv';

let _env: OldCloudFlareEnv | undefined;

export const OldEnvStore = {
    setEnv(env: OldCloudFlareEnv): void {
        _env = env;
    },
    get env(): OldCloudFlareEnv {
        if (_env === undefined) {
            throw new TypeError('EnvStore.env is not set');
        }
        return _env;
    },
};
