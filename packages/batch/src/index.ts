/**
 * Batch processing scripts
 * スクレイピングAPIからデータを取得し、メインAPIに流し込むバッチ処理
 */

import { runPlaceBatch } from './batch/placeBatch';
import { runRaceBatch } from './batch/raceBatch';
import type { ApiConfig } from './client/apiClient';
import type {
    BatchConfig,
    BatchResult,
    BatchTarget,
} from './types/batchConfig';

/**
 * バッチ処理のメインエントリーポイント
 * @param target 処理対象（place, race, all）
 * @param config バッチ設定
 * @param apiConfig API設定（省略時は環境変数から取得）
 */
export const runBatch = async (
    target: BatchTarget,
    config: BatchConfig,
    apiConfig?: ApiConfig,
): Promise<BatchResult[]> => {
    const results: BatchResult[] = [];

    if (target === 'place' || target === 'all') {
        const placeResult = await runPlaceBatch(config, apiConfig);
        results.push(placeResult);
    }

    if (target === 'race' || target === 'all') {
        const raceResult = await runRaceBatch(config, apiConfig);
        results.push(raceResult);
    }

    return results;
};

// エクスポート
export { runPlaceBatch } from './batch/placeBatch';
export { runRaceBatch } from './batch/raceBatch';
export type { ApiConfig } from './client/apiClient';
export type {
    BatchConfig,
    BatchResult,
    BatchTarget,
} from './types/batchConfig';
