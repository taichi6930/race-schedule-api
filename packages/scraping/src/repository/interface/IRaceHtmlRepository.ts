import type { RaceType } from '@race-schedule/shared/src/types/raceType';

export interface IRaceHtmlRepository {
    /**
     * raceのHTMLをWebから直接取得する
     * @param raceType - レース種別
     * @param date - 日付
     * @param location - 開催場所（文字列）
     * @param number - レース番号（JRA/BOATRACEのみ使用）
     */
    fetchRaceHtml: (
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ) => Promise<string>;

    /**
     * R2やローカルキャッシュからHTMLを取得する（なければnull）
     * @param raceType - レース種別
     * @param date - 日付
     * @param location - 開催場所（文字列）
     * @param number - レース番号（JRA/BOATRACEのみ使用）
     */
    loadRaceHtml: (
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ) => Promise<string | null>;

    /**
     * 取得したHTMLをR2やローカルに保存する
     * @param raceType - レース種別
     * @param date - 日付
     * @param html - HTML文字列
     * @param location - 開催場所（文字列）
     * @param number - レース番号（JRA/BOATRACEのみ使用）
     */
    saveRaceHtml: (
        raceType: RaceType,
        date: Date,
        html: string,
        location?: string,
        number?: number,
    ) => Promise<void>;
}
