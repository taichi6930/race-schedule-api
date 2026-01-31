/**
 * スクレイピングAPIのPlace レスポンス形式
 */
export interface ScrapingPlaceResponse {
    count: number;
    places: ScrapingPlaceDto[];
}

export interface ScrapingPlaceDto {
    raceType: string;
    datetime: string;
    placeName: string;
    placeGrade?: string;
    placeHeldDays?: {
        heldTimes: number;
        heldDayTimes: number;
    };
}

/**
 * スクレイピングAPIのRace レスポンス形式
 */
export interface ScrapingRaceResponse {
    count: number;
    races: ScrapingRaceDto[];
}

export interface ScrapingRaceDto {
    raceType: string;
    datetime: string;
    location: string;
    raceNumber: number;
    raceName: string;
    grade?: string;
    distance?: number;
    surfaceType?: string;
    stage?: string;
}

/**
 * API Upsert レスポンス形式
 */
export interface UpsertApiResponse {
    successCount: number;
    failureCount: number;
    failures: {
        db: string;
        id: string;
        reason: string;
    }[];
}
