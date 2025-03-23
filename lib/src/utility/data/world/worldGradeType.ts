import { z } from 'zod';

/**
 * WorldGradeTypeのzod型定義
 */
export const WorldGradeTypeSchema = z.string().refine((value) => {
    return WorldGradeTypeList.has(value);
}, '海外競馬のグレードではありません');

/**
 * WorldGradeTypeの型定義
 */
export type WorldGradeType = z.infer<typeof WorldGradeTypeSchema>;

/**
 * 海外競馬のグレード リスト
 */
const WorldGradeTypeList = new Set<string>([
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'Listed',
    '格付けなし',
]);

/**
 * 海外競馬の指定グレードリスト
 */
export const WorldSpecifiedGradeList: WorldGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'Listed',
    '格付けなし',
];

/**
 * 海外競馬のグレードのバリデーション
 * @param grade - 海外競馬のグレード
 * @returns - バリデーション済みの海外競馬のグレード
 */
export const validateWorldGradeType = (grade: string): WorldGradeType =>
    WorldGradeTypeSchema.parse(grade);
