import type { RaceCourse } from '../../lib/src/utility/validateAndType/raceCourse';
import type { RaceType } from '../utility/raceType';

/**
 * レースデータのHTMLを取得するGatewayのInterface
 */
export interface IRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 日付
     * @param place - 開催場
     * @returns レースデータのHTML
     */
    getRaceDataHtml: (
        raceType: RaceType,
        date: Date,
        place?: RaceCourse,
        number?: number,
    ) => Promise<string>;
}
