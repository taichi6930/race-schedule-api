import type { RaceType } from '@race-schedule/shared/src/types/raceType';

import type { PlaceHtmlEntity } from '../../entity/placeHtmlEntity';

/**
 * PlaceServiceのインターフェース
 */
export interface IPlaceService {
    /**
     * 開催場データを取得
     * @param raceType - レース種別
     * @param date - 日付
     */
    fetch: (raceType: RaceType, date: Date) => Promise<PlaceHtmlEntity[]>;
}
