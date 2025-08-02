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
 * @param raceType - レースの種類
 * @param grade - バリデーション対象のグレード
 * @returns バリデーション済みのグレード
 * @throws エラー - 対応するレースタイプがない場合
 * @throws エラー - グレードが不正な場合
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
 * グレードのバリデーションスキーマを生成する
 * @param allowed - 許可されているグレードのセット
 * @param errorMessage - エラーメッセージ
 * @returns ZodString
 */
const createGradeSchema = (
    allowed: ReadonlySet<string>,
    errorMessage: string,
): ZodString =>
    z.string().refine((value): value is string => {
        return allowed.has(value);
    }, errorMessage);

/**
 * グレード リスト
 * @param raceType
 */
const GradeTypeList: (raceType: RaceType) => Set<string> = (raceType) =>
    new Set<string>(
        GradeMasterList.filter((grade) =>
            grade.detail.some((detail) => detail.raceType === raceType),
        ).map((grade) => grade.gradeName),
    );

/**
 * AutoraceGradeTypeのzod型定義
 */
export const AutoraceGradeTypeSchema = createGradeSchema(
    GradeTypeList(RaceType.AUTORACE),
    'オートレースのグレードではありません',
);

/**
 * AutoraceGradeTypeの型定義
 */
export type AutoraceGradeType = z.infer<typeof AutoraceGradeTypeSchema>;

/**
 * JraGradeTypeのzod型定義
 */
export const JraGradeTypeSchema = createGradeSchema(
    GradeTypeList(RaceType.JRA),
    'JRAのグレードではありません',
);

/**
 * JraGradeTypeの型定義
 */
export type JraGradeType = z.infer<typeof JraGradeTypeSchema>;

/**
 * JRAの指定グレードリスト
 */
export const JraSpecifiedGradeList: JraGradeType[] = GradeMasterList.filter(
    (grade) =>
        grade.detail.some(
            (detail) => detail.raceType === RaceType.JRA && detail.isSpecified,
        ),
).map((grade) => grade.gradeName);

/**
 * WorldGradeTypeのzod型定義
 */
export const WorldGradeTypeSchema = createGradeSchema(
    GradeTypeList(RaceType.WORLD),
    '海外競馬のグレードではありません',
);

/**
 * WorldGradeTypeの型定義
 */
export type WorldGradeType = z.infer<typeof WorldGradeTypeSchema>;

/**
 * KeirinGradeTypeのzod型定義
 */
export const KeirinGradeTypeSchema = createGradeSchema(
    GradeTypeList(RaceType.KEIRIN),
    '競輪のグレードではありません',
);

/**
 * KeirinGradeTypeの型定義
 */
export type KeirinGradeType = z.infer<typeof KeirinGradeTypeSchema>;

/**
 * NarGradeTypeのzod型定義
 */
export const NarGradeTypeSchema = createGradeSchema(
    GradeTypeList(RaceType.NAR),
    '地方競馬のグレードではありません',
);

/**
 * NarGradeTypeの型定義
 */
export type NarGradeType = z.infer<typeof NarGradeTypeSchema>;

/**
 * 地方競馬の指定グレードリスト
 */
export const NarSpecifiedGradeList: NarGradeType[] = GradeMasterList.filter(
    (grade) =>
        grade.detail.some(
            (detail) => detail.raceType === RaceType.NAR && detail.isSpecified,
        ),
).map((grade) => grade.gradeName);

/**
 * BoatraceGradeTypeのzod型定義
 */
export const BoatraceGradeTypeSchema = createGradeSchema(
    GradeTypeList(RaceType.BOATRACE),
    'ボートレースのグレードではありません',
);

/**
 * BoatraceGradeTypeの型定義
 */
export type BoatraceGradeType = z.infer<typeof BoatraceGradeTypeSchema>;

/**
 * ボートレースの指定グレード リスト
 */
export const BoatraceSpecifiedGradeList: BoatraceGradeType[] =
    GradeMasterList.filter((grade) =>
        grade.detail.some(
            (detail) =>
                detail.raceType === RaceType.BOATRACE && detail.isSpecified,
        ),
    ).map((grade) => grade.gradeName);

/**
 * 海外競馬の指定グレード リスト
 */
export const WorldSpecifiedGradeList: WorldGradeType[] = GradeMasterList.filter(
    (grade) =>
        grade.detail.some(
            (detail) =>
                detail.raceType === RaceType.WORLD && detail.isSpecified,
        ),
).map((grade) => grade.gradeName);

/**
 * 競輪の指定グレードリスト
 */
export const KeirinSpecifiedGradeList: KeirinGradeType[] =
    GradeMasterList.filter((grade) =>
        grade.detail.some(
            (detail) =>
                detail.raceType === RaceType.KEIRIN && detail.isSpecified,
        ),
    ).map((grade) => grade.gradeName);

/**
 * オートレースの指定グレードリスト
 */
export const AutoraceSpecifiedGradeList: AutoraceGradeType[] =
    GradeMasterList.filter((grade) =>
        grade.detail.some(
            (detail) =>
                detail.raceType === RaceType.AUTORACE && detail.isSpecified,
        ),
    ).map((grade) => grade.gradeName);

/**
 * GradeTypeのzod型定義
 */
export const GradeTypeSchema = z.union([
    JraGradeTypeSchema,
    NarGradeTypeSchema,
    WorldGradeTypeSchema,
    KeirinGradeTypeSchema,
    AutoraceGradeTypeSchema,
    BoatraceGradeTypeSchema,
]);

/**
 * GradeTypeの型定義
 */
export type GradeType = z.infer<typeof GradeTypeSchema>;
