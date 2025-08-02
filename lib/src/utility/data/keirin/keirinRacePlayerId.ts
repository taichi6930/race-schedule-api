import { z } from 'zod';

import { RaceType } from '../../raceType';
import { validatePositionNumber } from '../common/positionNumber';
import { validateRaceNumber } from '../common/raceNumber';
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

/**
 * KeirinRacePlayerIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのKeirinRaceId
 */
export const validateKeirinRacePlayerId = (value: string): KeirinRacePlayerId =>
    KeirinRacePlayerIdSchema.parse(value);
