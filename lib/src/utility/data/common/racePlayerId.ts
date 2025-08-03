import { z } from 'zod';

import { RaceType } from '../../raceType';
import { validatePositionNumber } from './positionNumber';
import { validateRaceNumber } from './raceNumber';
/**
 * BoatraceRacePlayerIdのzod型定義
 * boatrace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
 */
const BoatraceRacePlayerIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('boatrace');
    }, 'boatraceから始まる必要があります')
    // boatraceの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
    .refine((value) => {
        return /^boatrace\d{14}$/.test(value);
    }, 'BoatraceRacePlayerIdの形式ではありません')
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
    // 枠番は1~8の範囲
    .refine((value) => {
        const positionNumber = Number.parseInt(value.slice(-2));
        try {
            validatePositionNumber(RaceType.BOATRACE, positionNumber);
            return true;
        } catch {
            return false;
        }
    }, '枠番は1~6の範囲である必要があります');

/**
 * BoatraceRacePlayerIdの型定義
 */
export type BoatraceRacePlayerId = z.infer<typeof BoatraceRacePlayerIdSchema>;

/**
 * RacePlayerIdのzod型定義
 */
export const UnionRacePlayerIdSchema = z.union([BoatraceRacePlayerIdSchema]);

/**
 * RacePlayerIdのzod型定義
 */
export type RacePlayerId = z.infer<typeof UnionRacePlayerIdSchema>;

/**
 * BoatraceRacePlayerIdのバリデーション
 * @param raceType
 * @param value - バリデーション対象
 * @returns バリデーション済みのBoatraceRaceId
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
const AutoraceRacePlayerIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('autorace');
    }, 'autoraceから始まる必要があります')
    // autoraceの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
    .refine((value) => {
        return /^autorace\d{14}$/.test(value);
    }, 'AutoraceRacePlayerIdの形式ではありません')
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
    // 枠番は1~8の範囲
    .refine((value) => {
        const positionNumber = Number.parseInt(value.slice(-2));
        try {
            validatePositionNumber(RaceType.AUTORACE, positionNumber);
            return true;
        } catch {
            return false;
        }
    }, '枠番は1~8の範囲である必要があります');
/**
 * AutoraceRacePlayerIdの型定義
 */

export type AutoraceRacePlayerId = z.infer<typeof AutoraceRacePlayerIdSchema>;

/**
 * KeirinRacePlayerIdのzod型定義
 * keirin + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
 */
const KeirinRacePlayerIdSchema = z
    .string()
    .refine((value) => value.startsWith('keirin'), {
        message: `keirinから始まる必要があります`,
    })
    // keirinの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
    .refine((value) => /^keirin\d{14}$/.test(value), {
        message: `KeirinRacePlayerIdの形式ではありません`,
    })
    // レース番号は1~12の範囲
    .refine(
        (value) => {
            const raceNumber = Number.parseInt(value.slice(-4, -2));
            try {
                validateRaceNumber(raceNumber);
                return true;
            } catch {
                return false;
            }
        },
        {
            message: `レース番号は1~12の範囲である必要があります`,
        },
    )
    // 枠番は1~9の範囲
    .refine(
        (value) => {
            const positionNumber = Number.parseInt(value.slice(-2));
            try {
                validatePositionNumber(RaceType.KEIRIN, positionNumber);
                return true;
            } catch {
                return false;
            }
        },
        {
            message: `枠番は1~9の範囲である必要があります`,
        },
    );
/**
 * KeirinRacePlayerIdの型定義
 */

export type KeirinRacePlayerId = z.infer<typeof KeirinRacePlayerIdSchema>;
