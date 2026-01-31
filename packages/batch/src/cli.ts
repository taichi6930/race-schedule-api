#!/usr/bin/env node
/**
 * Batch CLI Entry Point
 * スクレイピングAPIからデータを取得し、メインAPIに流し込むバッチ処理のCLI
 *
 * 使用例:
 *   npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 place
 *   npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 race
 *   npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 all
 */

// --- Cloud/SSM優先の環境変数ロード ---
import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';
import * as dotenv from 'dotenv';

/**
 * SSMから環境変数を取得しprocess.envにセットする
 * @param keys 取得したいパラメータ名配列
 * @param prefix SSMのパスprefix（例: /myapp/dev/）
 */
async function loadEnvFromSSM(keys: string[], prefix = ''): Promise<void> {
    try {
        const ssm = new SSMClient({});
        const names = keys.map((k) => (prefix ? `${prefix}${k}` : k));
        const cmd = new GetParametersCommand({
            Names: names,
            WithDecryption: true,
        });
        const res = await ssm.send(cmd);
        if (res.Parameters) {
            for (const p of res.Parameters) {
                if (p.Name && p.Value) {
                    // SSMのパスprefixを除去して環境変数名に
                    const key = prefix ? p.Name.replace(prefix, '') : p.Name;
                    process.env[key] ??= p.Value;
                }
            }
        }
    } catch (error) {
        console.warn('SSMからの環境変数取得に失敗:', error);
    }
}

// ここで必要な環境変数名を列挙
const keys = ['SCRAPING_API_URL', 'MAIN_API_URL'];
// prefixは必要に応じて変更（例: /race-schedule/dev/）
const ssmPrefix = process.env.SSM_PREFIX ?? '';
await loadEnvFromSSM(keys, ssmPrefix);

// dotenvはSSMで取得できなかったものだけ上書き
const envFile = process.env.BATCH_USE_TEST === 'true' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

// TEST_* 環境変数があれば SCRAPING_API_URL / MAIN_API_URL にマップ
if (process.env.BATCH_USE_TEST === 'true') {
    if (process.env.TEST_SCRAPING_API_URL) {
        process.env.SCRAPING_API_URL = process.env.TEST_SCRAPING_API_URL;
    }
    if (process.env.TEST_MAIN_API_URL) {
        process.env.MAIN_API_URL = process.env.TEST_MAIN_API_URL;
    }
}

import { RaceType } from '@race-schedule/shared/src/types/raceType';

import { runBatch } from './index';
import type { BatchConfig, BatchTarget } from './types/batchConfig';

const main = async (): Promise<void> => {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.error(
            'Usage: npx tsx src/cli.ts <raceType> <startDate> <finishDate> [target]',
        );
        console.error(
            '  raceType: JRA, NAR, KEIRIN, AUTORACE, BOATRACE, OVERSEAS',
        );
        console.error('  startDate: YYYY-MM-DD');
        console.error('  finishDate: YYYY-MM-DD');
        console.error('  target: place, race, all (default: all)');
        console.error('');
        console.error('Environment variables:');
        console.error(
            '  SCRAPING_API_URL: スクレイピングAPIのURL (default: http://localhost:8788)',
        );
        console.error(
            '  MAIN_API_URL: メインAPIのURL (default: http://localhost:8787)',
        );

        process.exit(1);
    }

    const [raceTypeArg, startDate, finishDate, targetArg = 'all'] = args;

    // raceType のバリデーション
    if (!Object.values(RaceType).includes(raceTypeArg as RaceType)) {
        console.error(`Invalid raceType: ${raceTypeArg}`);
        console.error(`Valid values: ${Object.values(RaceType).join(', ')}`);

        process.exit(1);
    }

    // target のバリデーション
    const validTargets: BatchTarget[] = ['place', 'race', 'all'];
    if (!validTargets.includes(targetArg as BatchTarget)) {
        console.error(`Invalid target: ${targetArg}`);
        console.error(`Valid values: ${validTargets.join(', ')}`);

        process.exit(1);
    }

    const config: BatchConfig = {
        raceType: raceTypeArg as RaceType,
        startDate,
        finishDate,
    };

    console.log('');
    console.log('==========================================');
    console.log('        Batch Processing Started');
    console.log('==========================================');
    console.log(`Target: ${targetArg}`);
    console.log(`RaceType: ${config.raceType}`);
    console.log(`Period: ${config.startDate} ~ ${config.finishDate}`);
    console.log(
        `Scraping API: ${process.env.SCRAPING_API_URL ?? 'http://localhost:8788'}`,
    );
    console.log(
        `Main API: ${process.env.MAIN_API_URL ?? 'http://localhost:8787'}`,
    );
    console.log('==========================================');
    console.log('');

    const results = await runBatch(targetArg as BatchTarget, config);

    console.log('');
    console.log('==========================================');
    console.log('        Batch Processing Complete');
    console.log('==========================================');

    let totalSuccess = 0;
    let totalFailure = 0;

    for (const result of results) {
        console.log(
            `[${result.target}] Success: ${result.successCount}, Failure: ${result.failureCount}`,
        );
        totalSuccess += result.successCount;
        totalFailure += result.failureCount;

        if (result.failures.length > 0) {
            console.log('  Failures:');
            for (const f of result.failures) {
                console.log(`    - ${f.id}: ${f.reason}`);
            }
        }
    }

    console.log('------------------------------------------');
    console.log(`Total: Success: ${totalSuccess}, Failure: ${totalFailure}`);
    console.log('==========================================');

    if (totalFailure > 0) {
        process.exit(1);
    }
};

// メイン関数実行（top-level await を使用してエラー処理）
try {
    await main();
} catch (error: unknown) {
    console.error('Batch processing failed:', error);

    process.exit(1);
}
