import type { PlaceHtmlEntity } from '../../../packages/scraping/src/entity/placeHtmlEntity';
import type { RaceHtmlEntity } from '../../../packages/scraping/src/entity/raceHtmlEntity';
import type { RaceType } from '../../../packages/shared/src/types/raceType';
import type { GradeType } from '../../../packages/shared/src/utilities/gradeType';

/**
 * ScrapingAPIを呼び出すGatewayのInterface
 */
export interface IScrapingApiGateway {
    /**
     * 開催場データを取得
     * @param raceTypeList - レース種別のリスト
     * @param startDate - 開始日
     * @param finishDate - 終了日
     * @param locationList - 開催場所のリスト（オプション）
     */
    fetchPlaceList: (
        raceTypeList: RaceType[],
        startDate: Date,
        finishDate: Date,
        locationList?: string[],
    ) => Promise<PlaceHtmlEntity[]>;

    /**
     * レースデータを取得
     * @param raceTypeList - レース種別のリスト
     * @param startDate - 開始日
     * @param finishDate - 終了日
     * @param locationList - 開催場所のリスト（オプション）
     * @param gradeList - グレードのリスト（オプション）
     */
    fetchRaceList: (
        raceTypeList: RaceType[],
        startDate: Date,
        finishDate: Date,
        locationList?: string[],
        gradeList?: GradeType[],
    ) => Promise<RaceHtmlEntity[]>;
}
