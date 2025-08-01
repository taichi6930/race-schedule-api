import { z } from 'zod';

import { RaceType } from '../../raceType';
import type { GradeType } from '../base';

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
 * @param raceType
 * @param grade - オートレースのグレード
 * @returns - バリデーション済みのオートレースのグレード
 */
export const validateGradeType = (
    raceType: RaceType,
    grade: string,
): GradeType => {
    switch (raceType) {
        case RaceType.JRA: {
            return JraGradeTypeSchema.parse(grade);
        }
        case RaceType.NAR: {
            return NarGradeTypeSchema.parse(grade);
        }
        case RaceType.WORLD: {
            return WorldGradeTypeSchema.parse(grade);
        }
        case RaceType.KEIRIN: {
            return KeirinGradeTypeSchema.parse(grade);
        }
        case RaceType.BOATRACE: {
            return BoatraceGradeTypeSchema.parse(grade);
        }
        case RaceType.AUTORACE: {
            return AutoraceGradeTypeSchema.parse(grade);
        }
        default: {
            throw new Error(`Unsupported race type`);
        }
    }
};

/**
 * オートレースの指定グレードリスト
 */
export const AutoraceSpecifiedGradeList: AutoraceGradeType[] = ['SG'];

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
 * ボートレースのグレード
 */
export const BoatraceSpecifiedGradeList: BoatraceGradeType[] = [
    'SG',
    'GⅠ',
    'GⅡ',
    'GⅢ',
];
