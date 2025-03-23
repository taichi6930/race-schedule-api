import { z } from 'zod';

import { validateKeirinPositionNumber } from './keirinPositionNumber';
import { validateKeirinRaceNumber } from './keirinRaceNumber';
/**
 * KeirinRacePlayerIdのzod型定義
 * keirin + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
 */
const KeirinRacePlayerIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('keirin');
    }, 'keirinから始まる必要があります')
    // keirinの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
    .refine((value) => {
        return /^keirin\d{8}\d{2}\d{2}\d{2}$/.test(value);
    }, 'KeirinRacePlayerIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = Number.parseInt(value.slice(-4, -2));
        try {
            validateKeirinRaceNumber(raceNumber);
            return true;
        } catch {
            return false;
        }
    }, 'レース番号は1~12の範囲である必要があります')
    // 枠番は1~8の範囲
    .refine((value) => {
        const positionNumber = Number.parseInt(value.slice(-2));
        try {
            validateKeirinPositionNumber(positionNumber);
            return true;
        } catch {
            return false;
        }
    }, '枠番は1~9の範囲である必要があります');

/**
 * KeirinRacePlayerIdの型定義
 */
export type KeirinRacePlayerId = z.infer<typeof KeirinRacePlayerIdSchema>;

/**
 * KeirinRacePlayerIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのKeirinRaceId
 */
export const validateKeirinRacePlayerId = (value: string): KeirinRacePlayerId =>
    KeirinRacePlayerIdSchema.parse(value);
