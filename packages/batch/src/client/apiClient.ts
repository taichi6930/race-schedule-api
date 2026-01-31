import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';

import type {
    ScrapingPlaceResponse,
    ScrapingRaceResponse,
    UpsertApiResponse,
} from '../types/apiResponse';

/**
 * API エンドポイントの環境設定
 */
export interface ApiConfig {
    /** スクレイピングAPIのベースURL */
    scrapingApiUrl: string;
    /** メインAPIのベースURL */
    mainApiUrl: string;
}

const defaultConfig: ApiConfig = {
    scrapingApiUrl: process.env.SCRAPING_API_URL ?? 'http://localhost:8788',
    mainApiUrl: process.env.MAIN_API_URL ?? 'http://localhost:8787',
};

/**
 * スクレイピングAPIからPlace情報を取得
 */
export const fetchScrapingPlaces = async (
    raceType: string,
    startDate: string,
    finishDate: string,
    config: ApiConfig = defaultConfig,
): Promise<ScrapingPlaceResponse> => {
    const url = new URL('/scraping/place', config.scrapingApiUrl);
    url.searchParams.set('startDate', startDate);
    url.searchParams.set('finishDate', finishDate);
    url.searchParams.set('raceTypeList', raceType);

    console.log(`Fetching places from: ${url.toString()}`);

    const response = await fetch(url.toString());
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Scraping API error: ${response.status} - ${text}`);
    }

    return response.json();
};

/**
 * スクレイピングAPIからRace情報を取得
 */
export const fetchScrapingRaces = async (
    raceType: string,
    startDate: string,
    finishDate: string,
    locationList?: string[],
    config: ApiConfig = defaultConfig,
): Promise<ScrapingRaceResponse> => {
    const url = new URL('/scraping/race', config.scrapingApiUrl);
    url.searchParams.set('startDate', startDate);
    url.searchParams.set('finishDate', finishDate);
    url.searchParams.set('raceTypeList', raceType);
    if (locationList && locationList.length > 0) {
        url.searchParams.set('locationList', locationList.join(','));
    }

    console.log(`Fetching races from: ${url.toString()}`);

    const response = await fetch(url.toString());
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Scraping API error: ${response.status} - ${text}`);
    }

    return response.json();
};

/**
 * メインAPIにPlace情報をupsert
 */
export const upsertPlaces = async (
    entities: PlaceEntity[],
    config: ApiConfig = defaultConfig,
): Promise<UpsertApiResponse> => {
    const url = new URL('/place', config.mainApiUrl);

    console.log(`Upserting ${entities.length} places to: ${url.toString()}`);

    // Date を ISO 文字列に変換
    const body = entities.map((e) => ({
        ...e,
        datetime:
            e.datetime instanceof Date ? e.datetime.toISOString() : e.datetime,
    }));

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Main API error: ${response.status} - ${text}`);
    }

    return response.json();
};

/**
 * メインAPIにRace情報をupsert
 */
export const upsertRaces = async (
    entities: RaceEntity[],
    config: ApiConfig = defaultConfig,
): Promise<UpsertApiResponse> => {
    const url = new URL('/race', config.mainApiUrl);

    console.log(`Upserting ${entities.length} races to: ${url.toString()}`);

    // Date を ISO 文字列に変換
    const body = entities.map((e) => ({
        ...e,
        datetime:
            e.datetime instanceof Date ? e.datetime.toISOString() : e.datetime,
    }));

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Main API error: ${response.status} - ${text}`);
    }

    return response.json();
};
