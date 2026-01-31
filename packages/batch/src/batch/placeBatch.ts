import type { ApiConfig } from '../client/apiClient';
import { fetchScrapingPlaces, upsertPlaces } from '../client/apiClient';
import { convertToPlaceEntities } from '../converter/placeConverter';
import type { BatchConfig, BatchResult } from '../types/batchConfig';

/**
 * Place バッチ処理を実行
 * スクレイピングAPIからPlace情報を取得し、メインAPIにupsertする
 */
export const runPlaceBatch = async (
    config: BatchConfig,
    apiConfig?: ApiConfig,
): Promise<BatchResult> => {
    const result: BatchResult = {
        target: 'place',
        successCount: 0,
        failureCount: 0,
        failures: [],
    };

    try {
        console.log('=== Place Batch Start ===');
        console.log(
            `RaceType: ${config.raceType}, StartDate: ${config.startDate}, FinishDate: ${config.finishDate}`,
        );

        // 1. スクレイピングAPIからPlace情報を取得
        const scrapingResponse = await fetchScrapingPlaces(
            config.raceType,
            config.startDate,
            config.finishDate,
            apiConfig,
        );

        console.log(
            `Fetched ${scrapingResponse.count} places from scraping API`,
        );

        if (scrapingResponse.places.length === 0) {
            console.log('No places to upsert');
            return result;
        }

        // 2. PlaceEntity に変換
        const entities = convertToPlaceEntities(scrapingResponse.places);
        console.log(`Converted to ${entities.length} PlaceEntities`);

        // 3. メインAPIにupsert
        const upsertResponse = await upsertPlaces(entities, apiConfig);

        result.successCount = upsertResponse.successCount;
        result.failureCount = upsertResponse.failureCount;
        result.failures = upsertResponse.failures.map((f) => ({
            id: f.id,
            reason: f.reason,
        }));

        console.log(
            `Upsert complete: ${result.successCount} success, ${result.failureCount} failed`,
        );
        console.log('=== Place Batch End ===');
    } catch (error) {
        console.error('Place batch error:', error);
        result.failureCount = 1;
        result.failures.push({
            id: 'batch',
            reason: error instanceof Error ? error.message : String(error),
        });
    }

    return result;
};
