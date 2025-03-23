import { z } from 'zod';

/**
 * NarRaceCourseのzod型定義
 */
export const NarRaceCourseSchema = z.string().refine((value) => {
    return NarRaceCourseList.has(value);
}, '地方の競馬場ではありません');

/**
 * NarRaceCourseの型定義
 */
export type NarRaceCourse = z.infer<typeof NarRaceCourseSchema>;

/**
 * 地方の競馬場 リスト
 */
const NarRaceCourseList = new Set([
    '北見ば',
    '岩見ば',
    '帯広ば',
    '旭川ば',
    '旭川',
    '門別',
    '札幌',
    '盛岡',
    '水沢',
    '上山',
    '新潟',
    '三条',
    '足利',
    '宇都宮',
    '高崎',
    '浦和',
    '船橋',
    '大井',
    '川崎',
    '金沢',
    '笠松',
    '名古屋',
    '中京',
    '園田',
    '姫路',
    '益田',
    '福山',
    '高知',
    '佐賀',
    '荒尾',
    '中津',
]);

/**
 * 地方競馬のレース場名とコードの対応表
 */
export const NarBabacodeMap: Record<string, string> = {
    北見ば: '1',
    岩見ば: '2',
    帯広ば: '3',
    旭川ば: '4',
    旭川: '7',
    門別: '36',
    札幌: '8',
    盛岡: '10',
    水沢: '11',
    上山: '12',
    新潟: '13',
    三条: '14',
    足利: '15',
    宇都宮: '16',
    高崎: '17',
    浦和: '18',
    船橋: '19',
    大井: '20',
    川崎: '21',
    金沢: '22',
    笠松: '23',
    名古屋: '24',
    中京: '25',
    園田: '27',
    姫路: '28',
    益田: '29',
    福山: '30',
    高知: '31',
    佐賀: '32',
    荒尾: '33',
    中津: '34',
};

/**
 * 開催地方競馬場のバリデーション
 */
export const validateNarRaceCourse = (course: string): NarRaceCourse =>
    NarRaceCourseSchema.parse(course);
