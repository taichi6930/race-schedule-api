import { Logger } from "../../utility/logger";
import { INarPlaceDataHtmlGateway } from "../interface/iNarPlaceDataHtmlGateway";
/**
 * 競馬場開催データのHTMLを取得するGateway
 */
export class NarPlaceDataHtmlGateway implements INarPlaceDataHtmlGateway {
    constructor() { }

    /**
     * 競馬場開催データのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - 競馬場開催データのHTML
     */
    @Logger
    async getPlaceDataHtml(date: Date): Promise<string> {
        try {
            // keibalabのURLからHTMLを取得する
            const url = `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${date.getFullYear()}&k_month=${date.getXDigitMonth(2)}`;
            const html = await fetch(url);
            console.debug("htmlを取得しています");
            const htmlText = await html.text();
            console.debug("htmlを取得できました");
            return htmlText;
        } catch (e) {
            throw new Error('htmlを取得できませんでした');
        }
    }
}