import { z } from 'zod';

import type { RaceType } from '../../../../src/utility/raceType';
import { validatePositionNumber } from '../../../../src/utility/validateAndType/positionNumber';
import { validateRaceNumber } from '../../../../src/utility/validateAndType/raceNumber';
import type { IdType, RaceIdParams, RacePlayerIdParams } from './placeId';
import { generateRaceId } from './raceId';

/**
 * racePlayerIdを作成する
 * @param idType
 * @param params
 */
export const generateRacePlayerId = (
    idType: IdType,
    params: RacePlayerIdParams,
): RacePlayerId => {
    const { raceType, dateTime, location, number, positionNumber } = params;
    const positionNumberCode = positionNumber.toXDigits(2);
    const raceIdParams: RaceIdParams = { raceType, dateTime, location, number };
    return `${generateRaceId(idType, raceIdParams)}${positionNumberCode}`;
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
export type RacePlayerId = z.infer<ReturnType<typeof RacePlayerIdSchema>>;

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
