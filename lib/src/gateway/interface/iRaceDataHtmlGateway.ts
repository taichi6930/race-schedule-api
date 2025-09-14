import type { RaceType } from '../../../../src/utility/raceType';
import type { RaceCourse } from '../../../../src/utility/validateAndType/raceCourse';

/**
 * レースデータのHTMLを取得するGatewayのInterface
 */
export interface IRaceDataHtmlGatewayForAWS {
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
