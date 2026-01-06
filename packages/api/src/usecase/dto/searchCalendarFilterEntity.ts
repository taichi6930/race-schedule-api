import type { RaceType } from '@race-schedule/shared/src/types';

/**
 * カレンダー検索フィルター
 *
 * レース種別リストは複数指定可能とする
 *
 * @property startDate - 検索開始日
 * @property finishDate - 検索終了日
 * @property raceTypeList - レース種別リスト
 */
export class SearchCalendarFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceTypeList: RaceType[],
    ) {}
}
