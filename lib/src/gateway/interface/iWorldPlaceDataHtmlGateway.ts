/**
 * 海外競馬の競馬場データをHTMLから取得するためのゲートウェイインターフェース
 */
export interface IWorldPlaceDataHtmlGateway {
    /**
     * 競馬場データのHTMLを取得する
     * @param date - 日付
     * @returns 競馬場データのHTML
     */
    getPlaceDataHtml: (date: Date) => Promise<string>;
}
