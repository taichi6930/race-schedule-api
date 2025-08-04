import { z } from 'zod';

import { RaceType } from '../../raceType';
import { validateRaceNumber } from './raceNumber';

/**
 * RaceIdのzod型定義
 * @param raceType
 */
const RaceIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return (
        z
            .string()
            .refine((value) => {
                return value.startsWith(lowerCaseRaceType);
            }, `${lowerCaseRaceType}から始まる必要があります`)
            // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号)
            .refine((value) => {
                return new RegExp(`^${lowerCaseRaceType}\\d{12}$`).test(value);
            }, `${lowerCaseRaceType}RaceIdの形式ではありません`)
            // レース番号は1~12の範囲
            .refine((value) => {
                const raceNumber = Number.parseInt(value.slice(-2));
                try {
                    validateRaceNumber(raceNumber);
                    return true;
                } catch {
                    return false;
                }
            }, 'レース番号は1~12の範囲である必要があります')
    );
};

/**
 * KeirinRaceIdのzod型定義
 */
const KeirinRaceIdSchema = RaceIdSchema(RaceType.KEIRIN);

/**
 * BoatraceRaceIdのzod型定義
 */
const BoatraceRaceIdSchema = RaceIdSchema(RaceType.BOATRACE);

/**
 * BoatraceRaceIdのzod型定義
 */
const NarRaceIdSchema = RaceIdSchema(RaceType.NAR);

/**
 * JraRaceIdのzod型定義
 */
const JraRaceIdSchema = RaceIdSchema(RaceType.JRA);

/**
 * RaceIdのzod型定義
 */
export type RaceId = z.infer<typeof UnionRaceIdSchema>;

/**
 * RaceIdのバリデーション
 * @param raceType
 * @param value - バリデーション対象
 * @returns バリデーション済みのRaceId
 */
export const validateRaceId = (raceType: RaceType, value: string): RaceId => {
    switch (raceType) {
        case RaceType.BOATRACE: {
            return BoatraceRaceIdSchema.parse(value);
        }
        case RaceType.KEIRIN: {
            return KeirinRaceIdSchema.parse(value);
        }
        case RaceType.AUTORACE: {
            return AutoraceRaceIdSchema.parse(value);
        }
        case RaceType.NAR: {
            return NarRaceIdSchema.parse(value);
        }
        case RaceType.JRA: {
            return JraRaceIdSchema.parse(value);
        }
        case RaceType.WORLD: {
            throw new Error(
                `RaceId validation is not supported for ${raceType}`,
            );
        }
        default: {
            throw new Error(`RaceId validation is not supported`);
        }
    }
};
/**
 * AutoraceRaceIdのzod型定義
 */
const AutoraceRaceIdSchema = RaceIdSchema(RaceType.AUTORACE);

/**
 * RaceIdのzod型定義
 */
export const UnionRaceIdSchema = z.union([
    KeirinRaceIdSchema,
    AutoraceRaceIdSchema,
    BoatraceRaceIdSchema,
    NarRaceIdSchema,
    JraRaceIdSchema,
]);
