import { createRaceUrl } from '../../utility/data/url';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { RaceCourse } from '../../utility/validateAndType/raceCourse';
import type { IRaceDataHtmlGateway } from '../interface/iRaceDataHtmlGateway';

/**
 * レースデータのHTMLを取得するGateway
 */
export class RaceDataHtmlGateway implements IRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 取得する年月
     * @param place - 開催場
     * @param number - レース番号
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        raceType: RaceType,
        date: Date,
        place?: RaceCourse,
        number?: number,
    ): Promise<string> {
        // gokeibaのURLからHTMLを取得する
        try {
            const url = createRaceUrl(raceType, date, place, number);
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (error: unknown) {
            console.error('HTML取得失敗:', error);
            throw new Error('HTMLの取得に失敗しました');
        }
    }
}
