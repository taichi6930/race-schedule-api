import { Logger } from '../../utility/logger';
import { IWorldRaceDataHtmlGateway } from '../interface/iWorldRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class WorldRaceDataHtmlGateway implements IWorldRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(date: Date): Promise<string> {
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
