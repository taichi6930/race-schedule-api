/**
 * JRAの競馬場データのHTMLを取得するGatewayのInterface
 */
export interface IJraPlaceDataHtmlGateway {
    /**
     * 競馬場データのHTMLを取得する
     * @param date - 取得する年月
     */
    getPlaceDataHtml: (date: Date) => Promise<string>;
}
