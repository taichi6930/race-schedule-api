/**
 * レーススケジュールAPI
 *
 * Cloudflare Workers上で動作する競馬・競輪・オートレース・競艇の
 * レーススケジュール管理APIのエントリーポイントです。
 *
 * @remarks
 * このモジュールは依存性注入コンテナの初期化と
 * ルーターのエクスポートを行います。
 */

import './di';
import './utility/format';

import { router } from './router';

/**
 * Cloudflare Workersのデフォルトエクスポート
 */
export default {
    fetch: router,
};
