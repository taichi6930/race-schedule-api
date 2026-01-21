import { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * RaceType型のtype guard関数
 */
export function isRaceType(value: unknown): value is RaceType {
    return (
        typeof value === 'string' &&
        Object.values(RaceType).includes(value as RaceType)
    );
}

/**
 * CourseCodeType型のtype guard関数
 */
export function isCourseCodeType(value: unknown): value is CourseCodeType {
    return (
        typeof value === 'string' &&
        Object.values(CourseCodeType).includes(value as CourseCodeType)
    );
}

/**
 * 文字列配列からRaceType配列への安全な変換
 */
export function parseRaceTypeList(values: string[]): RaceType[] {
    return values.filter(isRaceType);
}

/**
 * 文字列配列からCourseCodeType配列への安全な変換
 */
export function parseCourseCodeTypeList(values: string[]): CourseCodeType[] {
    return values.filter(isCourseCodeType);
}
