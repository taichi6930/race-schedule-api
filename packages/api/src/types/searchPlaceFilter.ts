import type { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * 開催場所検索フィルタパラメータ
 */
export interface SearchPlaceFilterParams {
    startDate: Date; // ISO8601文字列
    finishDate: Date; // ISO8601文字列
    raceTypeList: RaceType[];
    locationList?: string[]; // 開催場コード等での絞り込み（任意）
}
