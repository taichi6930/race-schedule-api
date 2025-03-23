import { Logger } from '../../utility/logger';
import { IJraPlaceDataHtmlGateway } from '../interface/iJraPlaceDataHtmlGateway';

/**
 * JRAの競馬場データのHTMLを取得するGatewayの実装
 */
export class JraPlaceDataHtmlGateway implements IJraPlaceDataHtmlGateway {
    constructor() {
        console.debug('JraPlaceDataHtmlGatewayが呼ばれました');
    }

    /**
     * 開催場データのHTMLを取得する
     * @param date - 取得する年月
     */
    @Logger
    async getPlaceDataHtml(date: Date): Promise<string> {
        // keibalabのURLからHTMLを取得する
        try {
            const url = `https://prc.jp/jraracingviewer/contents/seiseki/${date.getFullYear().toString()}/`;
            const html = await fetch(url);
            console.debug('htmlを取得しています');
            const htmlText = await html.text();
            console.debug('htmlを取得できました');
            return htmlText;
        } catch (error) {
            console.error(error, 'htmlを取得できませんでした');
            throw new Error('htmlを取得できませんでした');
        }
    }
}
