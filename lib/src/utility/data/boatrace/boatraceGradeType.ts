import { z } from 'zod';

/**
 * BoatraceGradeTypeのzod型定義
 */
export const BoatraceGradeTypeSchema = z.string().refine((value) => {
    return BoatraceGradeTypeList.has(value);
}, 'ボートレースのグレードではありません');

/**
 * BoatraceGradeTypeの型定義
 */
export type BoatraceGradeType = z.infer<typeof BoatraceGradeTypeSchema>;

/**
 * ボートレースのグレード リスト
 */
const BoatraceGradeTypeList = new Set<string>(['SG', 'GⅠ', 'GⅡ', 'GⅢ', '一般']);

/**
 * ボートレースのグレードのバリデーション
 * @param grade - ボートレースのグレード
 * @returns - バリデーション済みのボートレースのグレード
 */
export const validateBoatraceGradeType = (grade: string): BoatraceGradeType =>
    BoatraceGradeTypeSchema.parse(grade);

/**
 * ボートレースのグレード
 */
export const BoatraceSpecifiedGradeList: BoatraceGradeType[] = [
    'SG',
    'GⅠ',
    'GⅡ',
    'GⅢ',
];
