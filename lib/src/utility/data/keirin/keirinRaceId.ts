import { z } from 'zod';

import { validateRaceNumber } from '../common/raceNumber';

/**
 * KeirinRaceIdのzod型定義
 * keirin + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const KeirinRaceIdSchema = z
    .string()
    .refine((value) => value.startsWith('keirin'), {
        message: `keirinから始まる必要があります`,
    })
    // keirinの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => /^keirin\d{12}$/.test(value), {
        message: `KeirinRaceIdの形式ではありません`,
    })
    // レース番号は1~12の範囲
    .refine(
        (value) => {
            const raceNumber = Number.parseInt(value.slice(-2));
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
    );

/**
 * KeirinRaceIdの型定義
 */
export type KeirinRaceId = z.infer<typeof KeirinRaceIdSchema>;

/**
 * KeirinRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのKeirinRaceId
 */
export const validateKeirinRaceId = (value: string): KeirinRaceId =>
    KeirinRaceIdSchema.parse(value);
