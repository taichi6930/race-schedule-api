import type { BoatraceRaceCourse } from '../../utility/data/boatrace';

/**
 * 競輪場のレースデータのHTMLを取得するGatewayのInterface
 */
export interface IBoatraceRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date 日付
     * @param place 競馬場
     * @param number レース番号
     * @returns レースデータのHTML
     */
    getRaceDataHtml: (
        date: Date,
        place: BoatraceRaceCourse,
        number: number,
    ) => Promise<string>;
}
