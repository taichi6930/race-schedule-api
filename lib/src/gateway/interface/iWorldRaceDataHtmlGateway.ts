/**
 * 海外競馬のレースデータのHTMLを取得するGatewayのInterface
 */
export interface IWorldRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date - 日付
     * @returns レースデータのHTML
     */
    getRaceDataHtml: (date: Date) => Promise<string>;
}
