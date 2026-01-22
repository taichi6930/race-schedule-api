import type { RaceType } from '../../../packages/shared/src/types/raceType';
import type { RaceCourse } from '../../../packages/shared/src/utilities/raceCourse';

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
