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
 * 共通のIDスキーマ生成ヘルパー
 * @param raceType - レース種別
 * @param digitsAfterPrefix - 種別プレフィックスの後に来る数字の合計桁数
 * @param raceNumberSlice - レース番号が格納されているスライスの [start, end]（slice の引数）
 * @param positionNumberSlice - 枠番（/艇番）が格納されているスライスの [start, end]
 * @param idSuffix - エラーメッセージで使うID種別のサフィックス（例: "PlaceId"）
 */
const makeIdSchema = (
    raceType: RaceType,
    digitsAfterPrefix: number,
    raceNumberSlice?: [number, number?],
    positionNumberSlice?: [number, number?],
    idSuffix?: string,
): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    let schema = z
        .string()
        .refine(
            (value) => value.startsWith(lowerCaseRaceType),
            `${lowerCaseRaceType}から始まる必要があります`,
        )
        .refine(
            (value) =>
                new RegExp(
                    `^${lowerCaseRaceType}\\d{${digitsAfterPrefix}}$`,
                ).test(value),
            `${lowerCaseRaceType}${idSuffix ?? ''}の形式ではありません`,
        );

    if (raceNumberSlice) {
        schema = schema.refine((value) => {
            const raceNumber = Number.parseInt(
                value.slice(raceNumberSlice[0], raceNumberSlice[1]),
            );
            try {
                validateRaceNumber(raceNumber);
                return true;
            } catch {
                return false;
            }
        }, 'レース番号は1~12の範囲である必要があります');
    }

    if (positionNumberSlice) {
        schema = schema.refine((value) => {
            const positionNumber = Number.parseInt(
                value.slice(positionNumberSlice[0], positionNumberSlice[1]),
            );
            try {
                validatePositionNumber(raceType, positionNumber);
                return true;
            } catch {
                return false;
            }
        }, '枠番が不正です');
    }

    return schema as z.ZodString;
};

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
const PlaceIdSchema = (raceType: RaceType): z.ZodString =>
    makeIdSchema(raceType, 10, undefined, undefined, 'PlaceId');

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
const RaceIdSchema = (raceType: RaceType): z.ZodString =>
    // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号)
    makeIdSchema(raceType, 12, [-2], undefined, 'RaceId');

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
const RacePlayerIdSchema = (raceType: RaceType): z.ZodString =>
    // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
    // レース番号は (slice -4, -2)、枠番は (slice -2)
    makeIdSchema(raceType, 14, [-4, -2], [-2], 'RacePlayerId');
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
