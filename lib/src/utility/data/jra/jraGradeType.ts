import { z } from 'zod';

/**
 * JraGradeTypeのzod型定義
 */
export const JraGradeTypeSchema = z.string().refine((value) => {
    return JraGradeTypeList.has(value);
}, 'JRAのグレードではありません');

/**
 * JraGradeTypeの型定義
 */
export type JraGradeType = z.infer<typeof JraGradeTypeSchema>;

/**
 * JRAのグレード リスト
 */
const JraGradeTypeList = new Set<string>([
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'J.GⅠ',
    'J.GⅡ',
    'J.GⅢ',
    'JpnⅠ',
    'JpnⅡ',
    'JpnⅢ',
    '重賞',
    'Listed',
    'オープン特別',
    '格付けなし',
    'オープン',
    '3勝クラス',
    '2勝クラス',
    '1勝クラス',
    '1600万下',
    '1000万下',
    '900万下',
    '500万下',
    '未勝利',
    '未出走',
    '新馬',
]);

/**
 * JRAの指定グレードリスト
 */
export const JraSpecifiedGradeList: JraGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'J.GⅠ',
    'J.GⅡ',
    'J.GⅢ',
    'JpnⅠ',
    'JpnⅡ',
    'JpnⅢ',
    '重賞',
    'Listed',
    'オープン特別',
];

/**
 * 中央競馬のグレードのバリデーション
 * @param grade - 中央競馬のグレード
 * @returns - バリデーション済みの中央競馬のグレード
 */
export const validateJraGradeType = (grade: string): JraGradeType =>
    JraGradeTypeSchema.parse(grade);
