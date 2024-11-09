import { format } from 'date-fns';

import { AUTORACE_PLACE_CODE } from '../../utility/data/autorace';
import { AutoraceRaceCourse } from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { IAutoraceRaceDataHtmlGateway } from '../interface/iAutoraceRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class AutoraceRaceDataHtmlGateway
    implements IAutoraceRaceDataHtmlGateway
{
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(
        date: Date,
        place: AutoraceRaceCourse,
    ): Promise<string> {
        const raceDate = format(date, 'yyyyMMdd');
        const babacode = AUTORACE_PLACE_CODE[place];
        const url = `https://www.oddspark.com/autorace/OneDayRaceList.do?raceDy=${raceDate}&placeCd=${babacode}`;

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