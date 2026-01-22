import type { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * レースデータのHTMLを取得するGatewayのInterface
 */
export interface IRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 日付
     * @param location - 開催場（文字列）
     * @param number - レース番号（JRAのみ使用）
     * @returns レースデータのHTML
     */
    fetch: (
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ) => Promise<string>;
}
