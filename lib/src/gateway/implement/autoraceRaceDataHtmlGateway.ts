import { format } from 'date-fns';

import { AutoracePlaceCodeMap } from '../../utility/data/autorace/autoraceRaceCourse';
import { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';
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
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        date: Date,
        place: AutoraceRaceCourse,
    ): Promise<string> {
        const raceDate = format(date, 'yyyyMMdd');
        const babacode = AutoracePlaceCodeMap[place];
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
