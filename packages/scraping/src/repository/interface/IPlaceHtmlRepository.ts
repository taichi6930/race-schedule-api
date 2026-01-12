import type { PlaceId } from '@race-schedule/shared/src/types/placeId';

export interface IPlaceHtmlRepository {
    /**
     * placeのHTMLをWebから直接取得する
     */
    fetchPlaceHtml: (placeId: PlaceId) => Promise<string>;

    /**
     * R2やローカルキャッシュからHTMLを取得する（なければnull）
     */
    loadPlaceHtml: (placeId: PlaceId) => Promise<string | null>;

    /**
     * 取得したHTMLをR2やローカルに保存する
     */
    savePlaceHtml: (placeId: PlaceId, html: string) => Promise<void>;
}
