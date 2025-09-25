import { RaceType } from '../raceType';
import type { RaceCourse } from '../validateAndType/raceCourse';
import { CourseCodeType } from './course';

const NetkeibaBabacodeMap: Record<string, string> = {
    // 中央競馬
    札幌: '01',
    函館: '02',
    福島: '03',
    新潟: '04',
    東京: '05',
    中山: '06',
    中京: '07',
    京都: '08',
    阪神: '09',
    小倉: '10',

    // 地方競馬
    帯広ば: '65',
    門別: '30',
    盛岡: '35',
    水沢: '36',
    上山: '37',
    三条: '38',
    足利: '39',
    宇都宮: '40',
    高崎: '41',
    浦和: '42',
    船橋: '43',
    大井: '44',
    川崎: '45',
    金沢: '46',
    笠松: '47',
    名古屋: '48',
    園田: '50',
    姫路: '51',
    高知: '54',
    佐賀: '55',
    北見ば: '',
    岩見ば: '',
    旭川ば: '',
    旭川: '',
    益田: '',
    福山: '',
    荒尾: '',
    中津: '',
};

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

export const createNetkeibaBabacode = (location: RaceCourse): string => {
    const placeCodeMap = NetkeibaBabacodeMap;
    return placeCodeMap[location] ?? '';
};
