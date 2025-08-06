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
 * JraPlaceIdのzod型定義
 */
const JraPlaceIdSchema = PlaceIdSchema(RaceType.JRA);
/**
 * NarPlaceIdのzod型定義
 */
const NarPlaceIdSchema = PlaceIdSchema(RaceType.NAR);
/**
 * WorldPlaceIdのzod型定義
 */
const WorldPlaceIdSchema = PlaceIdSchema(RaceType.WORLD);
/**
 * KeirinPlaceIdのzod型定義
 */
const KeirinPlaceIdSchema = PlaceIdSchema(RaceType.KEIRIN);
/**
 * AutoracePlaceIdのzod型定義
 */
const AutoracePlaceIdSchema = PlaceIdSchema(RaceType.AUTORACE);
/**
 * BoatracePlaceIdのzod型定義
 */
const BoatracePlaceIdSchema = PlaceIdSchema(RaceType.BOATRACE);

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
export const validatePlaceId = (raceType: RaceType, value: string): PlaceId => {
    switch (raceType) {
        case RaceType.WORLD: {
            return WorldPlaceIdSchema.parse(value);
        }
        case RaceType.BOATRACE: {
            return BoatracePlaceIdSchema.parse(value);
        }
        case RaceType.KEIRIN: {
            return KeirinPlaceIdSchema.parse(value);
        }
        case RaceType.AUTORACE: {
            return AutoracePlaceIdSchema.parse(value);
        }
        case RaceType.NAR: {
            return NarPlaceIdSchema.parse(value);
        }
        case RaceType.JRA: {
            return JraPlaceIdSchema.parse(value);
        }

        default: {
            throw new Error(`PlaceId validation is not supported`);
        }
    }
};

/**
 * PlaceIdのzod型定義
 */
export const UnionPlaceIdSchema = z.union([
    KeirinPlaceIdSchema,
    AutoracePlaceIdSchema,
    BoatracePlaceIdSchema,
    NarPlaceIdSchema,
    JraPlaceIdSchema,
    WorldPlaceIdSchema,
]);
