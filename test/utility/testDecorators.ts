import type { EnvType } from '../../lib/src/utility/env';
import { ENV } from '../../lib/src/utility/env';

// 環境変数の定義をexport
export { allowedEnvs } from '../../lib/src/utility/env';

/**
 * すべての環境でテストを実行するデコレータ関数
 * @param name
 * @param fn
 */
export function AllTest(name: string, fn: jest.ProvidesCallback): void {
    it(name, fn);
}

/**
 * 特定の環境でのみテストを実行するデコレータ関数
 * @param name テスト名
 * @param envList 実行する環境のリスト
 * @param fn テスト関数
 */
export function OnlyEnv(
    name: string,
    envList: EnvType[],
    fn: jest.ProvidesCallback,
): void {
    if (envList.includes(ENV)) {
        it(name, fn);
    } else {
        it.skip(name, fn);
    }
}

/**
 * 特定の環境でのみテストをSkipするデコレータ関数
 * @param name テスト名
 * @param envList スキップする環境のリスト
 * @param fn テスト関数
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
