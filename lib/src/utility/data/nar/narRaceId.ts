import { z } from 'zod';

import { validateNarRaceNumber } from './narRaceNumber';

/**
 * NarRaceIdのzod型定義
 * nar + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const NarRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('nar');
    }, 'narから始まる必要があります')
    // narの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^nar\d{8}\d{2}\d{2}$/.test(value);
    }, 'NarRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-2));
        try {
            validateNarRaceNumber(raceNumber);
            return true;
        } catch {
            return false;
        }
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * NarRaceIdの型定義
 */
export type NarRaceId = z.infer<typeof NarRaceIdSchema>;

/**
 * NarRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのNarRaceId
 */
export const validateNarRaceId = (value: string | undefined): NarRaceId => {
    if (value === undefined) {
        throw new Error('NarRaceIdがundefinedです');
    }
    const result = NarRaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${value}`);
    }
    return result.data;
};
