import type { BoatraceRaceCourse } from '../../utility/data/boatrace/boatraceRaceCourse';
import type { BoatraceRaceNumber } from '../../utility/data/boatrace/boatraceRaceNumber';

/**
 * ボートレース場のレースデータのHTMLを取得するGatewayのInterface
 */
export interface IBoatraceRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date - 日付
     * @param place - ボートレース場
     * @param number - レース番号
     * @returns レースデータのHTML
     */
    getRaceDataHtml: (
        date: Date,
        place: BoatraceRaceCourse,
        number: BoatraceRaceNumber,
    ) => Promise<string>;
}
