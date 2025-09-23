import { format } from 'date-fns';
import { z } from 'zod';

import { NetkeibaBabacodeMap } from '../data/netkeiba';
import { RaceType } from '../raceType';
import { type PositionNumber, validatePositionNumber } from './positionNumber';
import { createPlaceCode, type RaceCourse } from './raceCourse';
import { validateRaceNumber } from './raceNumber';

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
    idSuffix: string,
    raceNumberSlice?: [number, number?],
    positionNumberSlice?: [number, number?],
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
            `${lowerCaseRaceType}${idSuffix}の形式ではありません`,
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

    return schema;
};

/**
 * 汎用ビルダ: idType に応じて適切な ID を構築する
 * @param idType - `IdType` のいずれか
 * @param params - PlaceIdParams | RaceIdParams | RacePlayerIdParams
 */
// 型ガード: idType と params の整合性をチェック
/**
 * @param p - 任意のパラメータ
 */
const isPlaceParams = (p: any): p is PlaceIdParams => {
    return (
        p !== undefined &&
        p.dateTime !== undefined &&
        p.location !== undefined &&
        p.raceType !== undefined
    );
};

/**
 * @param p - 任意のパラメータ
 */
const isRaceParams = (p: any): p is RaceIdParams => {
    return (
        p !== undefined &&
        p.dateTime !== undefined &&
        p.location !== undefined &&
        p.raceType !== undefined &&
        p.number !== undefined
    );
};

/**
 * @param p - 任意のパラメータ
 */
const isRacePlayerParams = (p: any): p is RacePlayerIdParams => {
    return (
        p !== undefined &&
        p.dateTime !== undefined &&
        p.location !== undefined &&
        p.raceType !== undefined &&
        p.number !== undefined &&
        p.positionNumber !== undefined
    );
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

const buildId = (
    idType: IdType,
    params: PlaceIdParams | RaceIdParams | RacePlayerIdParams,
): string => {
    const raceTypePrefix = params.raceType.toLowerCase();
    const locationCode =
        params.raceType === RaceType.JRA || params.raceType === RaceType.NAR
            ? NetkeibaBabacodeMap[params.location]
            : createPlaceCode(params.raceType, params.location);
    const dateCode = format(params.dateTime, 'yyyyMMdd');
    switch (idType) {
        case IdType.PLACE: {
            if (!isPlaceParams(params))
                throw new Error('Invalid params for PLACE');
            return `${raceTypePrefix}${dateCode}${locationCode}`;
        }
        case IdType.RACE: {
            if (!isRaceParams(params))
                throw new Error('Invalid params for RACE');
            const numberCode = params.number.toXDigits(2);
            return `${raceTypePrefix}${dateCode}${locationCode}${numberCode}`;
        }
        case IdType.PLAYER: {
            if (!isRacePlayerParams(params))
                throw new Error('Invalid params for PLAYER');
            const numberCode = params.number.toXDigits(2);
            const positionNumberCode = params.positionNumber.toXDigits(2);
            return `${raceTypePrefix}${dateCode}${locationCode}${numberCode}${positionNumberCode}`;
        }
    }
};

/**
 * PlaceIdのパラメータ
 */
interface PlaceIdParams {
    raceType: RaceType;
    dateTime: Date;
    location: RaceCourse;
}

/**
 * RaceIdのパラメータ
 */
interface RaceIdParams {
    raceType: RaceType;
    dateTime: Date;
    location: RaceCourse;
    number: number;
}

/**
 * RacePlayerIdのパラメータ
 */
interface RacePlayerIdParams {
    raceType: RaceType;
    dateTime: Date;
    location: RaceCourse;
    number: number;
    positionNumber: PositionNumber;
}

/**
 * 公営ギャンブルID（PlaceId, RaceId, RacePlayerId）のzod型定義
 */
export type PublicGamblingId = z.infer<ReturnType<typeof makeIdSchema>>;

/**
 * Idのバリデーション
 * @param idType - `IdType` のいずれか
 * @param raceType - レース種別
 * @param value - バリデーション対象
 * @returns バリデーション済みのId
 */
export const validateId = (
    idType: IdType,
    raceType: RaceType,
    value: string,
): PublicGamblingId => {
    switch (idType) {
        case IdType.PLACE: {
            return makeIdSchema(
                raceType,
                10,
                'PlaceId',
                undefined,
                undefined,
            ).parse(value);
        }
        case IdType.RACE: {
            // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号)
            return makeIdSchema(raceType, 12, 'RaceId', [-2], undefined).parse(
                value,
            );
        }
        case IdType.PLAYER: {
            // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
            return makeIdSchema(
                raceType,
                14,
                'RacePlayerId',
                [-4, -2],
                [-2],
            ).parse(value);
        }
    }
};

/**
 * placeIdを作成する
 * @param idType
 * @param idParams
 */
export const generateId = (
    idType: IdType,
    idParams: PlaceIdParams | RaceIdParams | RacePlayerIdParams,
): PublicGamblingId => {
    return buildId(idType, idParams);
};
