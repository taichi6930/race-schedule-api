/**
 * アプリケーションの環境設定を管理するモジュール
 *
 * このモジュールは、アプリケーションの動作環境を制御し、
 * 各環境に応じた適切な設定を提供します。
 * 主な機能：
 * - 環境変数の読み込みと検証
 * - 実行環境の型安全な管理
 * - 接続先の制御（Web/Mock/Local）
 */

import * as dotenv from 'dotenv';

// Node.js実行時のみ .env を読み込む
// Cloudflare Workers等のブラウザ/ワーカ系ランタイムでは `process` が存在しないため
// トップレベルで dotenv.config() を実行すると例外になる。したがって Node 環境で
// あることが明らかな場合にのみ読み込むガードを置く。
// runtimeで process が存在するかを globalThis 経由で確認する。
// TypeScript の型定義上 process が存在するケースでも、Cloudflare Workers のような
// ランタイムでは globalThis.process が undefined になるため、この方法で安全に判定できる。
const gwProcess = (globalThis as any).process;
if (gwProcess !== undefined && gwProcess.versions?.node !== undefined) {
    // .envファイルから環境変数を読み込み
    try {
        dotenv.config();
    } catch {
        // 念のため安全に無視する（読み込み失敗でプロセスを止めたくない）
    }
}

/**
 * アプリケーションがサポートする環境の定義
 *
 * 各環境は以下の特徴を持ちます：
 * @property production - 本番環境
 * - HTML: 本番Webサイトに接続
 * - S3: 本番バケットに接続
 * - 完全な機能セット
 * @property test - テスト環境
 * - HTML: モックリポジトリを使用
 * - S3: テスト用バケットに接続
 * - テスト実行用の設定
 * @property local - ローカル開発環境
 * - HTML: ローカルファイルを使用
 * - S3: モックストレージを使用
 * - 実際のデータで初期化
 * @property localNoInitData - 初期データなしの開発環境
 * - HTML: モックリポジトリを使用
 * - S3: 空のモックストレージ
 * - クリーンな状態でのテスト用
 * @property localInitMadeData - テストデータ付き開発環境
 * - HTML: モックリポジトリを使用
 * - S3: サンプルデータで初期化
 * - 機能開発とテスト用
 * @property githubActionsCi - CI/CD環境
 * - 自動テスト用に最適化
 * - HTMLスクレイピングをスキップ
 */
export const allowedEnvs = {
    production: 'PRODUCTION',
    test: 'TEST',
    local: 'LOCAL',
    localNoInitData: 'LOCAL_NO_INIT_DATA',
    localInitMadeData: 'LOCAL_INIT_MADE_DATA',
    githubActionsCi: 'GITHUB_ACTIONS_CI',
} as const;

/**
 * 環境タイプを表すユニオン型
 *
 * この型は、allowedEnvsオブジェクトから自動的に生成され、
 * 有効な環境値のみを受け入れる型安全性を提供します。
 */
export type EnvType = (typeof allowedEnvs)[keyof typeof allowedEnvs];

/**
 * 環境変数から実行環境を取得し、検証します
 * @param env - 環境変数から取得した環境文字列
 * @returns 検証済みの環境タイプ
 * @throws Error 無効な環境値が指定された場合
 * @example
 * ```typescript
 * // 有効な環境値の場合
 * const env = getEnv('PRODUCTION'); // returns 'PRODUCTION'
 *
 * // 無効な環境値の場合
 * const env = getEnv('INVALID');
 * // throws Error: Invalid ENV value: INVALID.
 * // Allowed values are: PRODUCTION, TEST, LOCAL...
 * ```
 */
const getEnv = (env: string | undefined): EnvType => {
    if (!Object.values(allowedEnvs).includes(env as EnvType)) {
        throw new Error(
            `Invalid ENV value: ${env ?? 'undefined'}. Allowed values are: ${Object.values(allowedEnvs).join(', ')}`,
        );
    }
    return env as EnvType;
};

/**
 * アプリケーションの現在の実行環境
 *
 * process.env.ENVから環境値を取得し、検証を行った後の
 * 安全な環境値を提供します。アプリケーション起動時に
 * 一度だけ評価され、以降は変更されません。
 */
/**
 * アプリケーションの現在の実行環境
 *
 * Cloudflare Workers のように `process` / `process.env` が存在しないランタイムでは
 * この値は undefined になります。Node.js 実行時は従来どおり検証済みの EnvType を返します。
 */
export const ENV: EnvType | undefined = gwProcess?.env?.ENV
    ? getEnv(gwProcess.env.ENV)
    : undefined;

// process.env が存在しないランタイムでは false を返す安全なフラグ
export const IS_SHORT_TEST = gwProcess?.env?.IS_SHORT_TEST === 'TRUE';

export const IS_LARGE_AMOUNT_DATA_TEST =
    gwProcess?.env?.IS_LARGE_AMOUNT_DATA_TEST === 'TRUE';
