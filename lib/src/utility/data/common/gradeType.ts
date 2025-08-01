import { z } from 'zod';

import { RaceType } from '../../raceType';
import type { GradeType } from '../base';
import { BoatraceGradeTypeSchema } from '../boatrace/boatraceGradeType';
import { JraGradeTypeSchema } from '../jra/jraGradeType';
import { KeirinGradeTypeSchema } from '../keirin/keirinGradeType';
import { NarGradeTypeSchema } from '../nar/narGradeType';
import { WorldGradeTypeSchema } from '../world/worldGradeType';

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
