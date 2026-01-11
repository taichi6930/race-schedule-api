import type { RaceType } from '../../../shared/src/types/raceType';

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
        raceType: RaceType,
        date: Date,
        html: string,
    ) => Promise<void>;
}
