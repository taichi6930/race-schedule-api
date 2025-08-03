import { z } from 'zod';

import { RaceType } from '../../raceType';
import { validatePositionNumber } from './positionNumber';
import { validateRaceNumber } from './raceNumber';

/**
 * BoatraceRacePlayerIdのzod型定義
 * boatrace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
 * @param raceType
 */
const RacePlayerIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return (
        z
            .string()
            .refine((value) => {
                return value.startsWith(lowerCaseRaceType);
            }, `${lowerCaseRaceType}から始まる必要があります`)
            // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
            .refine((value) => {
                return new RegExp(`^${lowerCaseRaceType}\\d{14}$`).test(value);
            }, `${lowerCaseRaceType}RacePlayerIdの形式ではありません`)
            // レース番号は1~12の範囲
            .refine((value) => {
                const raceNumber = Number.parseInt(value.slice(-4, -2));
                try {
                    validateRaceNumber(raceNumber);
                    return true;
                } catch {
                    return false;
                }
            }, 'レース番号は1~12の範囲である必要があります')
            // 枠番はRaceTypeに応じた範囲
            .refine((value) => {
                const positionNumber = Number.parseInt(value.slice(-2));
                try {
                    validatePositionNumber(raceType, positionNumber);
                    return true;
                } catch {
                    return false;
                }
            }, '枠番が不正です')
    );
};
/**
 * BoatraceRacePlayerIdのzod型定義
 */
const BoatraceRacePlayerIdSchema = RacePlayerIdSchema(RaceType.BOATRACE);

/**
 * BoatraceRacePlayerIdの型定義
 */
export type BoatraceRacePlayerId = z.infer<typeof BoatraceRacePlayerIdSchema>;

/**
 * RacePlayerIdのzod型定義
 */
export type RacePlayerId = z.infer<typeof UnionRacePlayerIdSchema>;

/**
 * RacePlayerIdのバリデーション
 * @param raceType
 * @param value - バリデーション対象
 * @returns バリデーション済みのRacePlayerId
 */
export const validateRacePlayerId = (
    raceType: RaceType,
    value: string,
): RacePlayerId => {
    switch (raceType) {
        case RaceType.BOATRACE: {
            return BoatraceRacePlayerIdSchema.parse(value);
        }
        case RaceType.KEIRIN: {
            return KeirinRacePlayerIdSchema.parse(value);
        }
        case RaceType.AUTORACE: {
            return AutoraceRacePlayerIdSchema.parse(value);
        }
        case RaceType.JRA:
        case RaceType.NAR:
        case RaceType.WORLD: {
            throw new Error(
                `RacePlayerId validation is not supported for ${raceType}`,
            );
        }
        default: {
            throw new Error(`RacePlayerId validation is not supported`);
        }
    }
};
/**
 * AutoraceRacePlayerIdのzod型定義
 * autorace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
 */
const AutoraceRacePlayerIdSchema = RacePlayerIdSchema(RaceType.AUTORACE);
/**
 * AutoraceRacePlayerIdの型定義
 */

export type AutoraceRacePlayerId = z.infer<typeof AutoraceRacePlayerIdSchema>;

/**
 * KeirinRacePlayerIdのzod型定義
 */
const KeirinRacePlayerIdSchema = RacePlayerIdSchema(RaceType.KEIRIN);

/**
 * KeirinRacePlayerIdの型定義
 */

export type KeirinRacePlayerId = z.infer<typeof KeirinRacePlayerIdSchema>;

/**
 * RacePlayerIdのzod型定義
 */
export const UnionRacePlayerIdSchema = z.union([
    KeirinRacePlayerIdSchema,
    AutoraceRacePlayerIdSchema,
    BoatraceRacePlayerIdSchema,
]);
