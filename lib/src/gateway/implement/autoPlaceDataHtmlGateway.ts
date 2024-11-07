import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { IAutoPlaceDataHtmlGateway } from '../interface/iAutoPlaceDataHtmlGateway';
/**
 * オートレース開催データのHTMLを取得するGateway
 */
export class AutoPlaceDataHtmlGateway implements IAutoPlaceDataHtmlGateway {
    /**
     * オートレース開催データのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - オートレース開催データのHTML
     */
    @Logger
    async getPlaceDataHtml(date: Date): Promise<string> {
        try {
            // oddsparkのURLからHTMLを取得する
            const url = `https://www.oddspark.com/autorace/KaisaiCalendar.do?target=${format(date, 'yyyyMM')}`;
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
