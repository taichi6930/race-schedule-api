import { z } from 'zod';

import { RaceType } from '../../raceType';
import { validatePositionNumber } from '../common/positionNumber';
import { validateRaceNumber } from '../common/raceNumber';
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
 * AutoraceRacePlayerIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのAutoraceRaceId
 */
export const validateAutoraceRacePlayerId = (
    value: string,
): AutoraceRacePlayerId => AutoraceRacePlayerIdSchema.parse(value);
