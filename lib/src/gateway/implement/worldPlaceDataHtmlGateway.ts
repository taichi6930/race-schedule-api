import { Logger } from '../../utility/logger';
import { IWorldPlaceDataHtmlGateway } from '../interface/iWorldPlaceDataHtmlGateway';

/**
 * 競馬場データのHTMLを取得するGateway
 */
export class WorldPlaceDataHtmlGateway implements IWorldPlaceDataHtmlGateway {
    /**
     * 競馬場データのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - 競馬場データのHTML
     */
    @Logger
    public async getPlaceDataHtml(date: Date): Promise<string> {
        const url = `https://world.jra-van.jp/schedule/?year=${date.getFullYear().toString()}&month=${(date.getMonth() + 1).toString()}`;

        // gokeibaのURLからHTMLを取得する
        try {
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
