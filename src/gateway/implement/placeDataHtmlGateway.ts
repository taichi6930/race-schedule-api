import { createPlaceUrl } from '../../utility/data/url';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlaceDataHtmlGateway } from '../interface/iPlaceDataHtmlGateway';

export class PlaceDataHtmlGateway implements IPlaceDataHtmlGateway {
    /**
     * 開催場データのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 取得する年月
     */
    @Logger
    public async getPlaceDataHtml(
        raceType: RaceType,
        date: Date,
    ): Promise<string> {
        const url = createPlaceUrl(raceType, date);
        console.debug('HTML取得URL:', url);
        try {
            const response = await fetch(url);
            const htmlText = await response.text();
            console.debug('HTML取得成功');
            return htmlText;
        } catch (error) {
            console.error('HTML取得失敗:', error);
            throw new Error('HTMLの取得に失敗しました');
        }
    }
}
