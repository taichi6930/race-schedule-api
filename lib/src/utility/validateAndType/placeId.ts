import { format } from 'date-fns';
import { z } from 'zod';

import { RaceType } from '../../../../src/utility/raceType';
import type { PositionNumber } from '../../../../src/utility/validateAndType/positionNumber';
import {
    createPlaceCode,
    type RaceCourse,
} from '../../../../src/utility/validateAndType/raceCourse';
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
 * IdTypeの判定関数
 * @param value - 判定対象の文字列
 * @returns IdTypeかどうかの真偽値
 */
