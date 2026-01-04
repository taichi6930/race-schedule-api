import type { CourseCodeType } from './courseCodeType';
import type { RaceType } from './raceType';

/**
 * コース情報の型定義
 */
export interface Course {
    raceType: RaceType; // レース種別
    courseCodeType: CourseCodeType; // コースコード種別
    placeName: string; // 開催場名
    placeCode: string; // 開催場コード
}
