import { z } from 'zod';

import { RaceType } from '../../raceType';
import { type PositionNumber, validatePositionNumber } from './positionNumber';
import type { RaceCourse } from './raceCourse';
import { generateRaceId } from './raceId';
import { type RaceNumber, validateRaceNumber } from './raceNumber';

/**
 * racePlayerIdを作成する
 * @param raceType - レース種別
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param positionNumber - 枠番
 */

export const generateRacePlayerId = (
    raceType: RaceType,
    dateTime: Date,
    location: RaceCourse,
    number: RaceNumber,
    positionNumber: PositionNumber,
): RacePlayerId => {
    const positionNumberCode = positionNumber.toXDigits(2);
    return `${generateRaceId(raceType, dateTime, location, number)}${positionNumberCode}`;
};

/**
 * RacePlayerIdのzod型定義
 * @param raceType - レース種別
 */
const RacePlayerIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return (
        z
            .string()
            .refine((value) => {
                return value.startsWith(lowerCaseRaceType);
            }, `${lowerCaseRaceType}から始まる必要があります`)
            // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
            .refine((value) => {
                return new RegExp(`^${lowerCaseRaceType}\\d{14}$`).test(value);
            }, `${lowerCaseRaceType}RacePlayerIdの形式ではありません`)
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
            // 枠番はRaceTypeに応じた範囲
            .refine((value) => {
                const positionNumber = Number.parseInt(value.slice(-2));
                try {
                    validatePositionNumber(raceType, positionNumber);
                    return true;
                } catch {
                    return false;
                }
            }, '枠番が不正です')
    );
};

/**
 * RacePlayerIdのzod型定義
 */
export type RacePlayerId = z.infer<typeof UnionRacePlayerIdSchema>;

/**
 * RacePlayerIdのバリデーション
 * @param raceType - レース種別
 * @param value - バリデーション対象
 * @returns バリデーション済みのRacePlayerId
 */
export const validateRacePlayerId = (
    raceType: RaceType,
    value: string,
): RacePlayerId => RacePlayerIdSchema(raceType).parse(value);

/**
 * RacePlayerIdのzod型定義
 */
export const UnionRacePlayerIdSchema = z.union([
    RacePlayerIdSchema(RaceType.KEIRIN),
    RacePlayerIdSchema(RaceType.AUTORACE),
    RacePlayerIdSchema(RaceType.BOATRACE),
]);
