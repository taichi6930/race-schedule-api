import { z } from 'zod';

/**
 * NarGradeTypeのzod型定義
 */
export const NarGradeTypeSchema = z.string().refine((value) => {
    return NarGradeTypeList.has(value);
}, '地方競馬のグレードではありません');

/**
 * NarGradeTypeの型定義
 */
export type NarGradeType = z.infer<typeof NarGradeTypeSchema>;

/**
 * 海外競馬のグレード リスト
 */
const NarGradeTypeList = new Set<string>([
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'JpnⅠ',
    'JpnⅡ',
    'JpnⅢ',
    '重賞',
    '地方重賞',
    'Listed',
    'オープン特別',
    '地方準重賞',
    '格付けなし',
    'オープン',
    '未格付',
    '一般',
]);

/**
 * 地方競馬の指定グレードリスト
 */
export const NarSpecifiedGradeList: NarGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'JpnⅠ',
    'JpnⅡ',
    'JpnⅢ',
    '重賞',
    'Listed',
    'オープン特別',
    '地方重賞',
    '地方準重賞',
];

/**
 * 地方競馬のグレードのバリデーション
 * @param grade - 地方競馬のグレード
 * @returns - バリデーション済みの地方競馬のグレード
 */
export const validateNarGradeType = (grade: string): NarGradeType =>
    NarGradeTypeSchema.parse(grade);
