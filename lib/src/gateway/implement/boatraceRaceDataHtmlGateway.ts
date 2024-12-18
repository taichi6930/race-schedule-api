import { format } from 'date-fns';

import {
    BOATRACE_PLACE_CODE,
    BoatraceRaceCourse,
} from '../../utility/data/boatrace';
import { Logger } from '../../utility/logger';
import { IBoatraceRaceDataHtmlGateway } from '../interface/iBoatraceRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class BoatraceRaceDataHtmlGateway
    implements IBoatraceRaceDataHtmlGateway
{
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @param place - ボートレース場
     * @param number - レース番号
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(
        date: Date,
        place: BoatraceRaceCourse,
        number: number,
    ): Promise<string> {
        const raceDate = format(date, 'yyyyMMdd');
        const babacode = BOATRACE_PLACE_CODE[place];
        const url = `https://www.boatrace.jp/owpc/pc/race/racelist?rno=${number.toString()}&hd=${raceDate}&jcd=${babacode}`;

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
