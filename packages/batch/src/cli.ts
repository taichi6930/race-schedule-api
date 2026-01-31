#!/usr/bin/env node
/* eslint-disable unicorn/prefer-top-level-await */
/**
 * Batch CLI Entry Point
 * スクレイピングAPIからデータを取得し、メインAPIに流し込むバッチ処理のCLI
 *
 * 使用例:
 *   npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 place
 *   npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 race
 *   npx tsx src/cli.ts JRA 2026-01-01 2026-01-31 all
 */

// --- Cloud優先の環境変数ロード（簡易: 環境変数プレフィックスを参照） ---
import * as dotenv from 'dotenv';

/**
 * 簡易的に Cloudflare 等の外部ストアを参照する代わりに
 * 実行時に渡されたプレフィックス付きの環境変数を読み取る。
 * 例: prefix='CF_' の場合、`CF_SCRAPING_API_URL` を探す。
 * @param keys 取得したいパラメータ名配列
 * @param prefix 環境変数プレフィックス（例: CF_）
 */
async function loadEnvFromCloudPrefix(
    keys: string[],
    prefix = '',
): Promise<void> {
    try {
        for (const k of keys) {
            const prefixed = prefix ? `${prefix}${k}` : k;
            const value = process.env[prefixed] ?? process.env[k];
            if (value) {
                process.env[k] ??= value;
            }
        }
    } catch (error) {
        console.warn('環境変数プレフィックスからの取得に失敗:', error);
    }
}

// bootstrap で初期化とメイン実行を行う（トップレベル await を避ける）
async function bootstrap(): Promise<void> {
    // ここで必要な環境変数名を列挙
    const keys = ['SCRAPING_API_URL', 'MAIN_API_URL'];
    // prefixは必要に応じて変更（例: CF_）
    const cfPrefix = process.env.CF_PREFIX ?? process.env.SSM_PREFIX ?? '';
    await loadEnvFromCloudPrefix(keys, cfPrefix);

    // dotenvはプレフィックスで取得できなかったものだけ上書き
    const envFile =
        process.env.BATCH_USE_TEST === 'true' ? '.env.test' : '.env';
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

// bootstrap 実行後に main を実行（トップレベル await を避ける）

bootstrap()
    .then(async () => main())
    .catch((error: unknown) => {
        console.error('Batch processing failed:', error);
        process.exit(1);
    });
