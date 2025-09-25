import { CourseCodeType, RaceCourseMasterList } from './course';

export const NetkeibaBabacodeMap: Record<string, string> = {
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
    北見ば: '63',
    岩見ば: '64',
    旭川ば: '66',
    旭川: '34',
    益田: '52',
    福山: '53',
    荒尾: '56',
    中津: '57',
};

export const NetkeibaBabacodeMapV2: Record<string, string> =
    RaceCourseMasterList.filter(
        (course) => course.courseCodeType === CourseCodeType.NETKEIBA,
    ).reduce<Record<string, string>>((map, course) => {
        map[course.placeName] = course.placeCode;
        return map;
    }, {});
