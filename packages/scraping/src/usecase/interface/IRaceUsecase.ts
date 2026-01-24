import type { RaceHtmlEntity } from '../entity/raceHtmlEntity';

/**
 * RaceUsecaseのインターフェース
 */
export interface IRaceUsecase {
    /**
     * 指定した条件でレースデータを取得
     * @param filter - 検索フィルタ
     * @returns レースエンティティの配列
     */
    fetch: (filter: {
        startDate: Date;
        finishDate: Date;
        raceTypeList: string[];
        locationList?: string[];
        gradeList?: string[];
    }) => Promise<RaceHtmlEntity[]>;
}
