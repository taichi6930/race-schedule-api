import type { ZodString } from 'zod';
import { z } from 'zod';

import { GradeMasterList } from '../../../lib/src/utility/data/grade';
import type { RaceType } from '../raceType';

/**
 * GradeTypeの型定義
 */
export type GradeType = z.infer<ReturnType<typeof GradeTypeSchema>>;

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
 * グレードのバリデーションスキーマを生成する
 * @param raceType - レース種別
 * @param errorMessage - エラーメッセージ
 * @returns ZodString
 */
const GradeTypeSchema = (raceType: RaceType): ZodString =>
    z.string().refine((value): value is string => {
        return GradeTypeList(raceType).has(value);
    }, `${raceType}のグレードではありません`);

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
): GradeType => GradeTypeSchema(raceType).parse(grade);

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
