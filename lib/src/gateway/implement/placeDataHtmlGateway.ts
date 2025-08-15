import '../../utility/format';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlaceDataHtmlGateway } from '../interface/iPlaceDataHtmlGateway';

export class PlaceDataHtmlGateway implements IPlaceDataHtmlGateway {
    public constructor() {
        console.debug('PlaceDataHtmlGatewayが呼ばれました');
    }

    /**
     * raceTypeとdateからURLを生成
     * @param raceType - レース種別
     * @param date - 日付
     */
    private buildUrl(raceType: RaceType, date: Date): string {
        switch (raceType) {
            case RaceType.JRA: {
                return `https://prc.jp/jraracingviewer/contents/seiseki/${date.getFullYear().toString()}/`;
            }
            case RaceType.NAR: {
                return `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${date.getFullYear()}&k_month=${date.getXDigitMonth(2)}`;
            }
            case RaceType.KEIRIN: {
                return `https://www.oddspark.com/keirin/KaisaiCalendar.do?target=${format(date, 'yyyyMM')}`;
            }
            case RaceType.AUTORACE: {
                return `https://www.oddspark.com/autorace/KaisaiCalendar.do?target=${format(date, 'yyyyMM')}`;
            }
            case RaceType.BOATRACE: {
                // 1~3月は1、4月~6月は2、7月~9月は3、10月~12月は4
                const quarter = Math.ceil((date.getMonth() + 1) / 3).toString();
                // ボートレースのURLはquarterを使って生成
                return `https://sports.yahoo.co.jp/boatrace/schedule/?quarter=${quarter}`;
            }
            case RaceType.OVERSEAS: {
                // WORLDは未対応
                throw new Error('未対応のraceTypeです');
            }
        }
    }

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
        const url = this.buildUrl(raceType, date);
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
