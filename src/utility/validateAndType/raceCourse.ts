import { z } from 'zod';

import type { CourseCodeType } from '../data/course';
import { RaceCourseMasterList } from '../data/course';
import type { RaceType } from '../raceType';

/**
 * 場リスト
 * @param raceType - レース種別
 */
const RaceCourseList = (raceType: RaceType): Set<string> => {
    return new Set(
        RaceCourseMasterList.filter(
            (course) => course.raceType === raceType,
        ).map((course) => course.placeName),
    );
};

/**
 * RaceCourseMasterListからraceTypeごとのPlaceCodeMapを生成するユーティリティ
 * レース場名とコードの対応表
 * @param raceType - レース種別
 * @returns placeName をキー、placeCode を値とするマップ
 */
const createPlaceCodeMap = (
    raceType: RaceType,
    courseCodeType: CourseCodeType,
): Record<string, string> => {
    const map: Record<string, string> = {};
    for (const course of RaceCourseMasterList) {
        if (
            course.raceType === raceType &&
            course.courseCodeType === courseCodeType
        ) {
            map[course.placeName] = course.placeCode;
        }
    }
    return map;
};

export const createPlaceCode = (
    raceType: RaceType,
    courseCodeType: CourseCodeType,
    location: RaceCourse,
): string => {
    const placeCodeMap = createPlaceCodeMap(raceType, courseCodeType);
    return placeCodeMap[location] ?? '';
};

/**
 * RaceCourseのzod型定義
 * @param raceType - レース種別
 */
const RaceCourseSchema = (raceType: RaceType): z.ZodString =>
    z.string().refine((value) => {
        return RaceCourseList(raceType).has(value);
    }, `${raceType}の開催場ではありません`);

/**
 * 開催場のバリデーション
 * @param raceType - レース種別
 * @param location - 開催場所
 */
export const validateRaceCourse = (
    raceType: RaceType,
    location: string,
): RaceCourse => RaceCourseSchema(raceType).parse(location);

/**
 * RaceCourseの型定義
 */
export type RaceCourse = z.infer<ReturnType<typeof RaceCourseSchema>>;
