import { z } from 'zod';

import { RaceType } from '../../raceType';

/**
 * PlaceIdのzod型定義
 * @param raceType
 */
const PlaceIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return (
        z
            .string()
            .refine((value) => {
                return value.startsWith(lowerCaseRaceType);
            }, `${lowerCaseRaceType}から始まる必要があります`)
            // raceTypeの後に8桁の数字（開催日） + 2桁の数字（開催場所）
            .refine((value) => {
                return new RegExp(`^${lowerCaseRaceType}\\d{10}$`).test(value);
            }, `${lowerCaseRaceType}PlaceIdの形式ではありません`)
    );
};

/**
 * PlaceIdのzod型定義
 */
export type PlaceId = z.infer<typeof UnionPlaceIdSchema>;

/**
 * PlaceIdのバリデーション
 * @param raceType
 * @param value - バリデーション対象
 * @returns バリデーション済みのPlaceId
 */
export const validatePlaceId = (raceType: RaceType, value: string): PlaceId =>
    PlaceIdSchema(raceType).parse(value);

/**
 * PlaceIdのzod型定義
 */
export const UnionPlaceIdSchema = z.union([
    PlaceIdSchema(RaceType.JRA),
    PlaceIdSchema(RaceType.NAR),
    PlaceIdSchema(RaceType.WORLD),
    PlaceIdSchema(RaceType.KEIRIN),
    PlaceIdSchema(RaceType.AUTORACE),
    PlaceIdSchema(RaceType.BOATRACE),
]);
