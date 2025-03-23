import { z } from 'zod';

import { validateBoatraceRaceNumber } from './boatraceRaceNumber';

/**
 * BoatraceRaceIdのzod型定義
 * boatrace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const BoatraceRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('boatrace');
    }, 'boatraceから始まる必要があります')
    // boatraceの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^boatrace\d{8}\d{2}\d{2}$/.test(value);
    }, 'BoatraceRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = Number.parseInt(value.slice(-2));
        try {
            validateBoatraceRaceNumber(raceNumber);
            return true;
        } catch {
            return false;
        }
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * BoatraceRaceIdの型定義
 */
export type BoatraceRaceId = z.infer<typeof BoatraceRaceIdSchema>;

/**
 * BoatraceRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのBoatraceRaceId
 */
export const validateBoatraceRaceId = (value: string): BoatraceRaceId =>
    BoatraceRaceIdSchema.parse(value);
