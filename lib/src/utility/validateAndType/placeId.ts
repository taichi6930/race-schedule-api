import { format } from 'date-fns';
import { z } from 'zod';

import { RaceType } from '../../../../src/utility/raceType';
import {
    type PositionNumber,
    validatePositionNumber,
} from '../../../../src/utility/validateAndType/positionNumber';
import {
    createPlaceCode,
    type RaceCourse,
} from '../../../../src/utility/validateAndType/raceCourse';
import { validateRaceNumber } from '../../../../src/utility/validateAndType/raceNumber';
import { NetkeibaBabacodeMap } from '../data/netkeiba';

/**
 * IDタイプの列挙型
 */
export const IdType = {
    PLACE: 'place',
    RACE: 'race',
    PLAYER: 'player',
} as const;

export type IdType = (typeof IdType)[keyof typeof IdType];

/**
 * PlaceIdのパラメータ
 */
export interface PlaceIdParams {
    raceType: RaceType;
    dateTime: Date;
    location: RaceCourse;
}

/**
 * RaceIdのパラメータ
 */
export interface RaceIdParams {
    raceType: RaceType;
    dateTime: Date;
    location: RaceCourse;
    number: number;
}

/**
 * RacePlayerIdのパラメータ
 */
export interface RacePlayerIdParams {
    raceType: RaceType;
    dateTime: Date;
    location: RaceCourse;
    number: number;
    positionNumber: PositionNumber;
}

/**
 * placeIdを作成する
 * @param idTYpe
 * @param idType
 * @param placeIdParams - PlaceIdのパラメータ
 */
export const generatePlaceId = (
    idType: IdType,
    placeIdParams: PlaceIdParams,
): PlaceId => {
    const { raceType, dateTime, location } = placeIdParams;
    const dateCode = format(dateTime, 'yyyyMMdd');

    const locationCode =
        raceType === RaceType.JRA || raceType === RaceType.NAR
            ? NetkeibaBabacodeMap[location]
            : createPlaceCode(raceType, location);
    const raceTypePrefix = raceType.toLowerCase();
    return `${raceTypePrefix}${dateCode}${locationCode}`;
};

/**
 * PlaceIdのzod型定義
 * @param raceType - レース種別
 */
const PlaceIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return z
        .string()
        .refine((value) => {
            return value.startsWith(lowerCaseRaceType);
        }, `${lowerCaseRaceType}から始まる必要があります`)
        .refine((value) => {
            return new RegExp(`^${lowerCaseRaceType}\\d{10}$`).test(value);
        }, `${lowerCaseRaceType}PlaceIdの形式ではありません`);
};

/**
 * PlaceIdのzod型定義
 */
export type PlaceId = z.infer<ReturnType<typeof PlaceIdSchema>>;

/**
 * PlaceIdのバリデーション
 * @param raceType - レース種別
 * @param value - バリデーション対象
 * @returns バリデーション済みのPlaceId
 */
export const validatePlaceId = (raceType: RaceType, value: string): PlaceId =>
    PlaceIdSchema(raceType).parse(value);

/**
 * raceIdを作成する
 * @param idType
 * @param raceIdParams
 */
export const generateRaceId = (
    idType: IdType,
    raceIdParams: RaceIdParams,
): RaceId => {
    const { raceType, dateTime, location, number } = raceIdParams;
    const numberCode = number.toXDigits(2);
    const placeIdParams: PlaceIdParams = { raceType, dateTime, location };
    return `${generatePlaceId(idType, placeIdParams)}${numberCode}`;
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
