import type { EnvType } from '../../src/utility/env';
import { ENV } from '../../src/utility/env';

/**
 * 特定の環境でのみテストをSkipするデコレータ関数
 * @param name - テスト名
 * @param envList - スキップする環境のリスト
 * @param fn - テスト関数
 */
export const SkipEnv = (
    name: string,
    envList: EnvType[],
    fn: jest.ProvidesCallback,
): void => {
    if (envList.includes(ENV)) {
        it.skip(name, fn);
    } else {
        it(name, fn);
    }
};
