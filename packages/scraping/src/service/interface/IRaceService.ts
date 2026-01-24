import type { RaceType } from '@race-schedule/shared/src/types/raceType';

import type { RaceHtmlEntity } from '../entity/raceHtmlEntity';

/**
 * RaceServiceのインターフェース
 */
export interface IRaceService {
    /**
     * レースデータを取得
     * @param raceType - レース種別
     * @param date - 日付
     * @param location - 開催場所
     * @param number - レース番号（JRA/BOATRACEのみ使用）
     */
    fetch: (
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ) => Promise<RaceHtmlEntity[]>;
}
