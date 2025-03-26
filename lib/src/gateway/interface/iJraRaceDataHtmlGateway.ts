/**
 * JRAのレースデータのHTMLを取得するGatewayのInterface
 */
export interface IJraRaceDataHtmlGateway {
    getRaceDataHtml: (date: Date) => Promise<string>;
}
