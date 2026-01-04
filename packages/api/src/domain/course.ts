import type { RaceType } from '../../../shared/src/types/raceType';

/**
 * コース情報の型定義
 */
export interface Course {
    raceType: RaceType; // レース種別
    courseCodeType: CourseCodeType; // コースコード種別
    placeName: string; // 開催場名
    placeCode: string; // 開催場コード
}

/**
 * コースコード種別の型定義
 */
export type CourseCodeType =
    (typeof CourseCodeType)[keyof typeof CourseCodeType];

/**
 * コースコード種別
 */
export const CourseCodeType = {
    // 公式
    OFFICIAL: 'OFFICIAL',
    // netkeiba
    NETKEIBA: 'NETKEIBA',
} as const;
