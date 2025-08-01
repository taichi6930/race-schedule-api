import type { RaceCourse } from '../../utility/data/base';
import type { RaceType } from '../../utility/raceType';

/**
 * レースデータのHTMLを取得するGatewayのInterface
 */
export interface IRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param raceType - レースの種類
     * @param date - 日付
     * @param place - 開催場
     * @returns レースデータのHTML
     */
    getRaceDataHtml: (
        raceType: RaceType,
        date: Date,
        place?: RaceCourse,
    ) => Promise<string>;
}
