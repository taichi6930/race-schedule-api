import { RaceType } from '../raceType';
import type { RaceCourse } from '../validateAndType/raceCourse';
import { CourseCodeType } from './course';

/**
 * RaceCourseのマスターデータ
 */
export const RaceCourseMasterList: {
    raceType: RaceType;
    courseCodeType: CourseCodeType;
    placeName: string;
    placeCode: string;
}[] = [
    // JRA（中央競馬）
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '札幌',
        placeCode: '01',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '函館',
        placeCode: '02',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '福島',
        placeCode: '03',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '新潟',
        placeCode: '04',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '東京',
        placeCode: '05',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '中山',
        placeCode: '06',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '中京',
        placeCode: '07',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '京都',
        placeCode: '08',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '阪神',
        placeCode: '09',
    },
    {
        raceType: RaceType.JRA,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '小倉',
        placeCode: '10',
    },

    // 地方競馬（NAR）
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '帯広ば',
        placeCode: '65',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '門別',
        placeCode: '30',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '盛岡',
        placeCode: '35',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '水沢',
        placeCode: '36',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '上山',
        placeCode: '37',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '三条',
        placeCode: '38',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '足利',
        placeCode: '39',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '宇都宮',
        placeCode: '40',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '高崎',
        placeCode: '41',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '浦和',
        placeCode: '42',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '船橋',
        placeCode: '43',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '大井',
        placeCode: '44',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '川崎',
        placeCode: '45',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '金沢',
        placeCode: '46',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '笠松',
        placeCode: '47',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '名古屋',
        placeCode: '48',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '園田',
        placeCode: '50',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '姫路',
        placeCode: '51',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '高知',
        placeCode: '54',
    },
    {
        raceType: RaceType.NAR,
        courseCodeType: CourseCodeType.NETKEIBA,
        placeName: '佐賀',
        placeCode: '55',
    },
];

/**
 * RaceCourseMasterListからraceTypeごとのPlaceCodeMapを生成するユーティリティ
 * レース場名とコードの対応表
 * @param raceType - レース種別
 * @returns placeName をキー、placeCode を値とするマップ
 */
const createPlaceCodeMap = (raceType: RaceType): Record<string, string> => {
    const map: Record<string, string> = {};
    for (const course of RaceCourseMasterList) {
        if (course.raceType === raceType) {
            map[course.placeName] = course.placeCode;
        }
    }
    return map;
};

export const createNetkeibaBabacode = (
    raceType: RaceType,
    location: RaceCourse,
): string => {
    const placeCodeMap = createPlaceCodeMap(raceType);
    return placeCodeMap[location] ?? '';
};
