import type { ApiConfig } from '../client/apiClient';
import {
    fetchScrapingPlaces,
    fetchScrapingRaces,
    upsertRaces,
} from '../client/apiClient';
import { convertToRaceEntities } from '../converter/raceConverter';
import type { BatchConfig, BatchResult } from '../types/batchConfig';

/**
 * Race バッチ処理を実行
 * まずスクレイピングAPIからPlace情報を取得し、
 * 各Placeに対してRace情報を取得、メインAPIにupsertする
 */
export const runRaceBatch = async (
    config: BatchConfig,
    apiConfig?: ApiConfig,
): Promise<BatchResult> => {
    const result: BatchResult = {
        target: 'race',
        successCount: 0,
        failureCount: 0,
        failures: [],
    };

    try {
        console.log('=== Race Batch Start ===');
        console.log(
            `RaceType: ${config.raceType}, StartDate: ${config.startDate}, FinishDate: ${config.finishDate}`,
        );

        // 1. まずスクレイピングAPIからPlace情報を取得（どの場所が開催しているかを知る）
        const placeResponse = await fetchScrapingPlaces(
            config.raceType,
            config.startDate,
            config.finishDate,
            apiConfig,
        );

        console.log(`Fetched ${placeResponse.count} places from scraping API`);

        if (placeResponse.places.length === 0) {
            console.log('No places found, skipping race fetch');
            return result;
        }

        // 2. 開催場所のリストを取得
        const locationList = [
            ...new Set(placeResponse.places.map((p) => p.placeName)),
        ];
        console.log(`Locations: ${locationList.join(', ')}`);

        // 3. スクレイピングAPIからRace情報を取得
        const raceResponse = await fetchScrapingRaces(
            config.raceType,
            config.startDate,
            config.finishDate,
            locationList,
            apiConfig,
        );

        console.log(`Fetched ${raceResponse.count} races from scraping API`);

        if (raceResponse.races.length === 0) {
            console.log('No races to upsert');
            return result;
        }

        // 4. RaceEntity に変換
        const entities = convertToRaceEntities(raceResponse.races);
        console.log(`Converted to ${entities.length} RaceEntities`);

        // 5. メインAPIにupsert
        const upsertResponse = await upsertRaces(entities, apiConfig);

        result.successCount = upsertResponse.successCount;
        result.failureCount = upsertResponse.failureCount;
        result.failures = upsertResponse.failures.map((f) => ({
            id: f.id,
            reason: f.reason,
        }));

        console.log(
            `Upsert complete: ${result.successCount} success, ${result.failureCount} failed`,
        );
        console.log('=== Race Batch End ===');
    } catch (error) {
        console.error('Race batch error:', error);
        result.failureCount = 1;
        result.failures.push({
            id: 'batch',
            reason: error instanceof Error ? error.message : String(error),
        });
    }

    return result;
};
