import '../../utility/format';

import { format } from 'date-fns';

import { RaceCourse } from '../../utility/data/base';
import { KeirinPlaceCodeMap } from '../../utility/data/keirin/keirinRaceCourse';
import { NarBabacodeMap } from '../../utility/data/nar/narRaceCourse';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IRaceDataHtmlGateway } from '../interface/iRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class RaceDataHtmlGateway implements IRaceDataHtmlGateway {
    private buildUrl(
        raceType: RaceType,
        date: Date,
        place: RaceCourse | undefined,
    ): string {
        if (raceType === RaceType.NAR) {
            const raceDate = `${date.getFullYear().toString()}%2f${date.getXDigitMonth(2)}%2f${date.getXDigitDays(2)}`;
            if (place === undefined) {
                throw new Error('NARレースの開催場が指定されていません');
            }
            const babacode = NarBabacodeMap[place];
            return `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${raceDate}&k_babaCode=${babacode}`;
        }
        if (raceType === RaceType.KEIRIN) {
            const raceDate = format(date, 'yyyyMMdd');
            if (place === undefined) {
                throw new Error('NARレースの開催場が指定されていません');
            }
            const babacode = KeirinPlaceCodeMap[place];
            return `https://www.oddspark.com/keirin/AllRaceList.do?joCode=${babacode}&kaisaiBi=${raceDate}`;
        }

        throw new Error('未対応のraceTypeです');
    }

    /**
     * レースデータのHTMLを取得する
     * @param raceType
     * @param date - 取得する年月
     * @param place - 開催場
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        raceType: RaceType,
        date: Date,
        place?: RaceCourse,
    ): Promise<string> {
        // gokeibaのURLからHTMLを取得する
        try {
            const url = this.buildUrl(raceType, date, place);
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
