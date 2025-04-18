import { z } from 'zod';

/**
 * AutoraceRaceCourseのzod型定義
 */
export const AutoraceRaceCourseSchema = z.string().refine((value) => {
    return AutoraceRaceCourseList.has(value);
}, 'オートレース場ではありません');

/**
 * AutoraceRaceCourseの型定義
 */
export type AutoraceRaceCourse = z.infer<typeof AutoraceRaceCourseSchema>;

/**
 * オートレース場リスト
 */
const AutoraceRaceCourseList = new Set([
    '船橋',
    '川口',
    '伊勢崎',
    '浜松',
    '飯塚',
    '山陽',
]);

/**
 * 開催オートレース場のバリデーション
 * @param course
 */
export const validateAutoraceRaceCourse = (
    course: string,
): AutoraceRaceCourse => AutoraceRaceCourseSchema.parse(course);

/**
 * オートレースのレース場名とコードの対応表
 */
export const AutoracePlaceCodeMap: Record<string, string> = {
    船橋: '01',
    川口: '02',
    伊勢崎: '03',
    浜松: '04',
    飯塚: '05',
    山陽: '06',
};
