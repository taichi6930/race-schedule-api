import '../../utility/format';

import {
    NarBabacodeMap,
    NarRaceCourse,
} from '../../utility/data/nar/narRaceCourse';
import { Logger } from '../../utility/logger';
import { INarRaceDataHtmlGateway } from '../interface/iNarRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class NarRaceDataHtmlGateway implements INarRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        date: Date,
        place: NarRaceCourse,
    ): Promise<string> {
        const raceDate = `${date.getFullYear().toString()}%2f${date.getXDigitMonth(2)}%2f${date.getXDigitDays(2)}`;
        const babacode = NarBabacodeMap[place];
        const url = `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${raceDate}&k_babaCode=${babacode}`;

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
