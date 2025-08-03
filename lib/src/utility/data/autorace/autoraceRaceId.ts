import { z } from 'zod';

import { validateRaceNumber } from '../common/raceNumber';

/**
 * AutoraceRaceIdのzod型定義
 * autorace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const AutoraceRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('autorace');
    }, 'autoraceから始まる必要があります')
    // autoraceの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^autorace\d{12}$/.test(value);
    }, 'autoraceRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = Number.parseInt(value.slice(-2));
        try {
            validateRaceNumber(raceNumber);
            return true;
        } catch {
            return false;
        }
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * AutoraceRaceIdの型定義
 */
export type AutoraceRaceId = z.infer<typeof AutoraceRaceIdSchema>;

/**
 * AutoraceRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのAutoraceRaceId
 */
export const validateAutoraceRaceId = (value: string): AutoraceRaceId =>
    AutoraceRaceIdSchema.parse(value);
