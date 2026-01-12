import { format } from 'date-fns';

import { RaceType } from '../types/raceType';
import { formatMonthDigits } from './format';

export const createPlaceUrl = (raceType: RaceType, date: Date): string => {
    switch (raceType) {
        case RaceType.JRA: {
            return `https://prc.jp/jraracingviewer/contents/seiseki/${date.getFullYear().toString()}/`;
        }
        case RaceType.NAR: {
            return `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${date.getFullYear()}&k_month=${formatMonthDigits(date, 2)}`;
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
            // OVERSEASは未対応
            throw new Error('未対応のraceTypeです');
        }
    }
};
