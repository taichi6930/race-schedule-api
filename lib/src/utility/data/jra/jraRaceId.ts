import { z } from 'zod';

import { validateJraRaceNumber } from './jraRaceNumber';

/**
 * JraRaceIdのzod型定義
 * jra + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const JraRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('jra');
    }, 'jraから始まる必要があります')
    // jraの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^jra\d{8}\d{2}\d{2}$/.test(value);
    }, 'JraRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = Number.parseInt(value.slice(-2));
        try {
            validateJraRaceNumber(raceNumber);
            return true;
        } catch {
            return false;
        }
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * JraRaceIdの型定義
 */
export type JraRaceId = z.infer<typeof JraRaceIdSchema>;

/**
 * JraRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのJraRaceId
 */
export const validateJraRaceId = (value: string): JraRaceId =>
    JraRaceIdSchema.parse(value);
