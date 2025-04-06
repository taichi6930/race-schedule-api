import { allowedEnvs, ENV } from '../../lib/src/utility/env';

/**
 * すべての環境でテストを実行するデコレータ関数
 */
export function AllTest(name: string, fn: jest.ProvidesCallback): void {
    it(name, fn);
}

/**
 * CI環境でのみテストを実行するデコレータ関数
 */
export function CIOnly(name: string, fn: jest.ProvidesCallback): void {
    if (process.env.CI === 'true') {
        it(name, fn);
    } else {
        it.skip(name, fn);
    }
}

/**
 * GitHub Actions CI環境以外でテストを実行するデコレータ関数
 */
export function SkipGitHubActionsCI(
    name: string,
    fn: jest.ProvidesCallback,
): void {
    if (ENV === allowedEnvs.githubActionsCi) {
        it.skip(name, fn);
    } else {
        it(name, fn);
    }
}

/**
 * GitHub Actions CI環境でのみテストを実行するデコレータ関数
 */
export function GitHubActionsCIOnly(
    name: string,
    fn: jest.ProvidesCallback,
): void {
    if (ENV === allowedEnvs.githubActionsCi) {
        it(name, fn);
    } else {
        it.skip(name, fn);
    }
}
