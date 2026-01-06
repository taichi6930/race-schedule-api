import type { RaceType } from '../../../shared/src/types/raceType';

/**
 * カレンダーデータDTOのインターフェース定義
 */
export interface CalendarDataDto {
    id: string;
    raceType: RaceType;
    title: string;
    startTime: string; // ISO8601文字列
    endTime: string; // ISO8601文字列
    location: string;
    description: string;
}

/**
 * カレンダーフィルタパラメータのインターフェース定義
 */
export interface CalendarFilterParams {
    startDate: Date;
    finishDate: Date;
    raceTypeList: RaceType[];
}
