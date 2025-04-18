import type { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';

/**
 * オートレース場のレースデータのHTMLを取得するGatewayのInterface
 */
export interface IAutoraceRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date - 日付
     * @param place - オートレース場
     * @returns レースデータのHTML
     */
    getRaceDataHtml: (date: Date, place: AutoraceRaceCourse) => Promise<string>;
}
