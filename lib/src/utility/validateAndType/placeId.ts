import { format } from 'date-fns';
import { z } from 'zod';

import { NetkeibaBabacodeMap } from '../data/netkeiba';
import { RaceType } from '../raceType';
import { createPlaceCode, type RaceCourse } from './raceCourse';

/**
 * placeIdを作成する
 * @param raceType - レース種別
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generatePlaceId = (
    raceType: RaceType,
    dateTime: Date,
    location: RaceCourse,
): PlaceId => {
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
