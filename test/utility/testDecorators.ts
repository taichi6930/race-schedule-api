import type { EnvType } from '../../lib/src/utility/envForAws';
import { ENV } from '../../lib/src/utility/envForAws';

/**
 * 特定の環境でのみテストをSkipするデコレータ関数
 * @param name - テスト名
 * @param envList - スキップする環境のリスト
 * @param fn - テスト関数
 */
export function SkipEnv(
    name: string,
    envList: EnvType[],
    fn: jest.ProvidesCallback,
): void {
    if (envList.includes(ENV)) {
        it.skip(name, fn);
    } else {
        it(name, fn);
    }
}
