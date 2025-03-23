import { z } from 'zod';

export const BoatracePlaceCodeMap: Record<string, string> = {
    桐生: '01',
    戸田: '02',
    江戸川: '03',
    平和島: '04',
    多摩川: '05',
    浜名湖: '06',
    蒲郡: '07',
    常滑: '08',
    津: '09',
    三国: '10',
    びわこ: '11',
    住之江: '12',
    尼崎: '13',
    鳴門: '14',
    丸亀: '15',
    児島: '16',
    宮島: '17',
    徳山: '18',
    下関: '19',
    若松: '20',
    芦屋: '21',
    福岡: '22',
    唐津: '23',
    大村: '24',
};

const BoatraceRaceCourseList = new Set([
    '桐生',
    '戸田',
    '江戸川',
    '平和島',
    '多摩川',
    '浜名湖',
    '蒲郡',
    '常滑',
    '津',
    '三国',
    'びわこ',
    '住之江',
    '尼崎',
    '鳴門',
    '丸亀',
    '児島',
    '宮島',
    '徳山',
    '下関',
    '若松',
    '芦屋',
    '福岡',
    '唐津',
    '大村',
]);

/**
 * BoatraceRaceCourseのzod型定義
 */
export const BoatraceRaceCourseSchema = z.string().refine((value) => {
    return BoatraceRaceCourseList.has(value);
}, 'ボートレース場ではありません');

/**
 * BoatraceRaceCourseの型定義
 */
export type BoatraceRaceCourse = z.infer<typeof BoatraceRaceCourseSchema>;

/**
 * 開催ボートレース場のバリデーション
 */
export const validateBoatraceRaceCourse = (
    course: string,
): BoatraceRaceCourse => BoatraceRaceCourseSchema.parse(course);
