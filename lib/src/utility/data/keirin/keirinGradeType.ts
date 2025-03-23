import { z } from 'zod';

/**
 * KeirinGradeTypeのzod型定義
 */
export const KeirinGradeTypeSchema = z.string().refine((value) => {
    return KeirinGradeTypeList.has(value);
}, '競輪のグレードではありません');

/**
 * KeirinGradeTypeの型定義
 */
export type KeirinGradeType = z.infer<typeof KeirinGradeTypeSchema>;

/**
 * 競輪のグレード リスト
 */
const KeirinGradeTypeList = new Set<string>([
    'GP',
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'FⅠ',
    'FⅡ',
]);

/**
 * 競輪の指定グレードリスト
 */
export const KeirinSpecifiedGradeList: KeirinGradeType[] = [
    'GP',
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'FⅠ',
    'FⅡ',
];

/**
 * 競輪のグレードのバリデーション
 * @param grade - 競輪のグレード
 * @returns - バリデーション済みの競輪のグレード
 */
export const validateKeirinGradeType = (grade: string): KeirinGradeType =>
    KeirinGradeTypeSchema.parse(grade);
