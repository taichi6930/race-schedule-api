import type { RaceType } from '@race-schedule/shared';

export interface IPlaceHtmlRepository {
    /**
     * placeのHTMLをWebから直接取得する
     */
    fetchPlaceHtml: (raceType: RaceType, date: Date) => Promise<string>;

    /**
     * R2やローカルキャッシュからHTMLを取得する（なければnull）
     */
    loadPlaceHtml: (raceType: RaceType, date: Date) => Promise<string | null>;

    /**
     * 取得したHTMLをR2やローカルに保存する
     */
    savePlaceHtml: (
        aceType: RaceType,
        date: Date,
        html: string,
    ) => Promise<void>;
}
