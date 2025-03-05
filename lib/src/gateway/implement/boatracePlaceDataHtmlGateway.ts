import { Logger } from '../../utility/logger';
import { IBoatracePlaceDataHtmlGateway } from '../interface/iBoatracePlaceDataHtmlGateway';
/**
 * ボートレース開催データのHTMLを取得するGateway
 */
export class BoatracePlaceDataHtmlGateway
    implements IBoatracePlaceDataHtmlGateway
{
    /**
     * 開催データのHTMLを取得する
     * @param quarter - 取得するクォーター
     * @returns Promise<string> - 開催データのHTML
     */
    @Logger
    async getPlaceDataHtml(quarter: string): Promise<string> {
        try {
            // oddsparkのURLからHTMLを取得する
            const url = `https://sports.yahoo.co.jp/boatrace/schedule/?quarter=${quarter}`;
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
