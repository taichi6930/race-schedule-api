import type { KeirinRaceCourse } from '../../utility/data/keirin';

/**
 * 競輪場のレースデータのHTMLを取得するGatewayのInterface
 */
export interface IKeirinRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date 日付
     * @param place 競馬場
     * @returns レースデータのHTML
     */
    getRaceDataHtml: (date: Date, place: KeirinRaceCourse) => Promise<string>;
}
