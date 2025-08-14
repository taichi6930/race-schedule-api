import type { ZodString } from 'zod';
import { z } from 'zod';

import { RaceType } from '../../raceType';

/**
 * グレードのマスターリスト
 */
const GradeMasterList: {
    gradeName: string;
    detail: { raceType: RaceType; isSpecified: boolean }[];
}[] = [
    {
        gradeName: 'SG',
        detail: [
            { raceType: RaceType.BOATRACE, isSpecified: true },
            { raceType: RaceType.AUTORACE, isSpecified: true },
        ],
    },
    {
        gradeName: 'GP',
        detail: [{ raceType: RaceType.KEIRIN, isSpecified: true }],
    },
    {
        gradeName: '特GⅠ',
        detail: [{ raceType: RaceType.AUTORACE, isSpecified: true }],
    },
    {
        gradeName: 'GⅠ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
            { raceType: RaceType.BOATRACE, isSpecified: false },
            { raceType: RaceType.WORLD, isSpecified: true },
            { raceType: RaceType.KEIRIN, isSpecified: true },
            { raceType: RaceType.AUTORACE, isSpecified: false },
        ],
    },
    {
        gradeName: 'GⅡ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
            { raceType: RaceType.BOATRACE, isSpecified: false },
            { raceType: RaceType.WORLD, isSpecified: true },
            { raceType: RaceType.KEIRIN, isSpecified: true },
            { raceType: RaceType.AUTORACE, isSpecified: false },
        ],
    },
    {
        gradeName: 'GⅢ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
            { raceType: RaceType.BOATRACE, isSpecified: false },
            { raceType: RaceType.WORLD, isSpecified: true },
            { raceType: RaceType.KEIRIN, isSpecified: true },
        ],
    },
    {
        gradeName: 'JpnⅠ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: 'JpnⅡ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: 'JpnⅢ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: 'J.GⅠ',
        detail: [{ raceType: RaceType.JRA, isSpecified: true }],
    },
    {
        gradeName: 'J.GⅡ',
        detail: [{ raceType: RaceType.JRA, isSpecified: true }],
    },
    {
        gradeName: 'J.GⅢ',
        detail: [{ raceType: RaceType.JRA, isSpecified: true }],
    },
    {
        gradeName: 'FⅠ',
        detail: [{ raceType: RaceType.KEIRIN, isSpecified: true }],
    },
    {
        gradeName: 'FⅡ',
        detail: [{ raceType: RaceType.KEIRIN, isSpecified: true }],
    },
    {
        gradeName: 'Listed',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
            { raceType: RaceType.WORLD, isSpecified: true },
        ],
    },
    {
        gradeName: '重賞',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: '地方重賞',
        detail: [{ raceType: RaceType.NAR, isSpecified: true }],
    },
    {
        gradeName: '地方準重賞',
        detail: [{ raceType: RaceType.NAR, isSpecified: true }],
    },
    {
        gradeName: 'オープン特別',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: '一般',
        detail: [
            { raceType: RaceType.NAR, isSpecified: false },
            { raceType: RaceType.BOATRACE, isSpecified: false },
        ],
    },
    {
        gradeName: '開催',
        detail: [{ raceType: RaceType.AUTORACE, isSpecified: false }],
    },
    {
        gradeName: '格付けなし',
        detail: [
            { raceType: RaceType.JRA, isSpecified: false },
            { raceType: RaceType.NAR, isSpecified: false },
            { raceType: RaceType.WORLD, isSpecified: true },
        ],
    },
    {
        gradeName: 'オープン',
        detail: [
            { raceType: RaceType.JRA, isSpecified: false },
            { raceType: RaceType.NAR, isSpecified: false },
        ],
    },
    {
        gradeName: '未格付',
        detail: [{ raceType: RaceType.NAR, isSpecified: false }],
    },
    {
        gradeName: '3勝クラス',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '2勝クラス',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '1勝クラス',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '1600万下',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '1000万下',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '900万下',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '500万下',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '未勝利',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '未出走',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '新馬',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
];

/**
 * グレードのバリデーション
 * @param raceType - レース種別
 * @param grade - バリデーション対象のグレード
 * @returns バリデーション済みのグレード
 * @throws エラー - 対応するレースタイプがない場合
 * @throws エラー - グレードが不正な場合
 */
export const validateGradeType = (
    raceType: RaceType,
    grade: string,
): GradeType => createGradeSchema(raceType).parse(grade);

/**
 * グレードのバリデーションスキーマを生成する
 * @param raceType - レース種別
 * @param errorMessage - エラーメッセージ
 * @returns ZodString
 */
const createGradeSchema = (raceType: RaceType): ZodString =>
    z.string().refine((value): value is string => {
        return GradeTypeList(raceType).has(value);
    }, `${raceType}のグレードではありません`);

/**
 * グレード リスト
 * @param raceType - レース種別
 */
const GradeTypeList: (raceType: RaceType) => Set<string> = (raceType) =>
    new Set<string>(
        GradeMasterList.filter((grade) =>
            grade.detail.some((detail) => detail.raceType === raceType),
        ).map((grade) => grade.gradeName),
    );

/**
 * 指定グレードリスト
 * @param raceType - レース種別
 */
export const SpecifiedGradeList: (raceType: RaceType) => GradeType[] = (
    raceType,
) =>
    GradeMasterList.filter((grade) =>
        grade.detail.some(
            (detail) => detail.raceType === raceType && detail.isSpecified,
        ),
    ).map((grade) => grade.gradeName);

/**
 * GradeTypeのzod型定義
 */
export const GradeTypeSchema = z.union([
    createGradeSchema(RaceType.JRA),
    createGradeSchema(RaceType.NAR),
    createGradeSchema(RaceType.WORLD),
    createGradeSchema(RaceType.KEIRIN),
    createGradeSchema(RaceType.AUTORACE),
    createGradeSchema(RaceType.BOATRACE),
]);

/**
 * GradeTypeの型定義
 */
export type GradeType = z.infer<typeof GradeTypeSchema>;
