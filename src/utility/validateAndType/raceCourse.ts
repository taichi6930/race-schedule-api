import { z } from 'zod';

import { CourseCodeType, RaceCourseMasterList } from '../data/course';
import { RaceType } from '../raceType';

/**
 * 場リスト
 * @param raceType - レース種別
 */
const RaceCourseList = (raceType: RaceType): Set<string> => {
    const RaceCourseMasterListForOfficial = RaceCourseMasterList.filter(
        (course) => course.courseCodeType === CourseCodeType.OFFICIAL,
    );
    return new Set(
        RaceCourseMasterListForOfficial.filter(
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
    if (raceType === RaceType.JRA) {
        throw new Error(
            'JRAのレース場コード作成されていないため、使用できません',
        );
    }
    const filteredRaceCourseMasterList = RaceCourseMasterList.filter(
        (course) => course.courseCodeType === courseCodeType,
    );
    const map: Record<string, string> = {};
    for (const course of filteredRaceCourseMasterList) {
        if (course.raceType === raceType) {
            map[course.placeName] = course.placeCode;
        }
    }
    return map;
};

export const createPlaceCode = (
    raceType: RaceType,
    courseCodeType: CourseCodeType,
    location: RaceCourse,
): string => createPlaceCodeMap(raceType, courseCodeType)[location] ?? '';

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
