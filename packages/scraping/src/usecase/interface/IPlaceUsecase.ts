import type { PlaceHtmlEntity } from '../entity/placeHtmlEntity';

/**
 * PlaceUsecaseのインターフェース
 */
export interface IPlaceUsecase {
    /**
     * 全開催場を取得
     * @param raceType - レース種別
     * @param date - 日付
     */
    getAllPlaces: (raceType: string, date: Date) => Promise<PlaceHtmlEntity[]>;

    /**
     * 指定した条件で開催場データを取得
     * @param filter - 検索フィルタ
     * @returns 開催場エンティティの配列
     */
    fetch: (filter: {
        startDate: Date;
        finishDate: Date;
        raceTypeList: string[];
        locationList?: string[];
    }) => Promise<PlaceHtmlEntity[]>;
}
