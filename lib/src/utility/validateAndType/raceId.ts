import { z } from 'zod';

import type { RaceType } from '../../../../src/utility/raceType';
import { generatePlaceId } from './placeId';
import type { RaceCourse } from './raceCourse';
import { type RaceNumber, validateRaceNumber } from './raceNumber';

/**
 * raceIdを作成する
 * @param raceType - レース種別
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */

export const generateRaceId = (
    raceType: RaceType,
    dateTime: Date,
    location: RaceCourse,
    number: RaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generatePlaceId(raceType, dateTime, location)}${numberCode}`;
};

/**
 * RaceIdのzod型定義
 * @param raceType - レース種別
 */
const RaceIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return (
        z
            .string()
            .refine((value) => {
                return value.startsWith(lowerCaseRaceType);
            }, `${lowerCaseRaceType}から始まる必要があります`)
            // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号)
            .refine((value) => {
                return new RegExp(`^${lowerCaseRaceType}\\d{12}$`).test(value);
            }, `${lowerCaseRaceType}RaceIdの形式ではありません`)
            // レース番号は1~12の範囲
            .refine((value) => {
                const raceNumber = Number.parseInt(value.slice(-2));
                try {
                    validateRaceNumber(raceNumber);
                    return true;
                } catch {
                    return false;
                }
            }, 'レース番号は1~12の範囲である必要があります')
    );
};

/**
 * RaceIdのzod型定義
 */
export type RaceId = z.infer<ReturnType<typeof RaceIdSchema>>;

/**
 * RaceIdのバリデーション
 * @param raceType - レース種別
 * @param value - バリデーション対象
 * @returns バリデーション済みのRaceId
 */
export const validateRaceId = (raceType: RaceType, value: string): RaceId =>
    RaceIdSchema(raceType).parse(value);
