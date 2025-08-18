import '../../utility/format';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlaceDataHtmlGateway } from '../interface/iPlaceDataHtmlGateway';

export class PlaceDataHtmlGateway implements IPlaceDataHtmlGateway {
    public constructor() {
        console.debug('PlaceDataHtmlGatewayが呼ばれました');
    }

    
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
                
                const quarter = Math.ceil((date.getMonth() + 1) / 3).toString();
                
                return `https://sports.yahoo.co.jp/boatrace/schedule/?quarter=${quarter}`;
            }
            case RaceType.OVERSEAS: {
                
                throw new Error('未対応のraceTypeです');
            }
        }
    }

    
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
