import '../../utility/format';

import { Logger } from '../../utility/logger';
import { INarPlaceDataHtmlGateway } from '../interface/iNarPlaceDataHtmlGateway';
/**
 * 競馬場開催データのHTMLを取得するGateway
 */
export class NarPlaceDataHtmlGateway implements INarPlaceDataHtmlGateway {
    /**
     * 開催データのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - 開催データのHTML
     */
    @Logger
    public async getPlaceDataHtml(date: Date): Promise<string> {
        try {
            // keibalabのURLからHTMLを取得する
            const url = `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${date.getFullYear().toString()}&k_month=${date.getXDigitMonth(2)}`;
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
