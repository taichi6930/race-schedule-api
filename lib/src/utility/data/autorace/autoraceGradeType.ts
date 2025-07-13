import { z } from 'zod';

/**
 * AutoraceGradeTypeのzod型定義
 */
export const AutoraceGradeTypeSchema = z
    .string()
    .refine((value) => AutoraceGradeTypeList.has(value), {
        message: `オートレースのグレードではありません`,
    });

/**
 * AutoraceGradeTypeの型定義
 */
export type AutoraceGradeType = z.infer<typeof AutoraceGradeTypeSchema>;

/**
 * ボートレースのグレード リスト
 */
const AutoraceGradeTypeList = new Set<string>([
    'SG',
    '特GⅠ',
    'GⅠ',
    'GⅡ',
    '開催',
]);

/**
 * オートレースのグレードのバリデーション
 * @param grade - オートレースのグレード
 * @returns - バリデーション済みのオートレースのグレード
 */
export const validateAutoraceGradeType = (grade: string): AutoraceGradeType =>
    AutoraceGradeTypeSchema.parse(grade);

/**
 * オートレースの指定グレードリスト
 */
export const AutoraceSpecifiedGradeList: AutoraceGradeType[] = ['SG'];
