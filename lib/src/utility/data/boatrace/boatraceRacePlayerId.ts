import { z } from 'zod';

import { validateBoatracePositionNumber } from './boatracePositionNumber';
import { validateBoatraceRaceNumber } from './boatraceRaceNumber';
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
        return /^boatrace\d{8}\d{2}\d{2}\d{2}$/.test(value);
    }, 'BoatraceRacePlayerIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = Number.parseInt(value.slice(-4, -2));
        try {
            validateBoatraceRaceNumber(raceNumber);
            return true;
        } catch {
            return false;
        }
    }, 'レース番号は1~12の範囲である必要があります')
    // 枠番は1~8の範囲
    .refine((value) => {
        const positionNumber = Number.parseInt(value.slice(-2));
        try {
            validateBoatracePositionNumber(positionNumber);
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
 * BoatraceRacePlayerIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのBoatraceRaceId
 */
export const validateBoatraceRacePlayerId = (
    value: string,
): BoatraceRacePlayerId => BoatraceRacePlayerIdSchema.parse(value);
