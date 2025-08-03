import { z } from 'zod';

import { RaceType } from '../../raceType';

export const validatePositionNumber = (
    raceType: RaceType,
    positionNumber: number,
): PositionNumber => {
    switch (raceType) {
        case RaceType.AUTORACE: {
            return AutoracePositionNumberSchema.parse(positionNumber);
        }
        case RaceType.BOATRACE: {
            return BoatracePositionNumberSchema.parse(positionNumber);
        }
        case RaceType.KEIRIN: {
            return KeirinPositionNumberSchema.parse(positionNumber);
        }
        case RaceType.JRA:
        case RaceType.NAR:
        case RaceType.WORLD: {
            throw new Error(
                `Position number validation is not supported for race type: ${raceType}`,
            );
        }
        default: {
            throw new Error('Invalid race type');
        }
    }
};

/**
 * PositionNumber zod型定義
 * @param min
 * @param max
 */
const PositionNumberSchema: (min: number, max: number) => z.ZodNumber = (
    min,
    max,
) =>
    z
        .number()
        .int()
        .min(min, `枠番は${min}以上である必要があります`)
        .max(max, `枠番は${max}以下である必要があります`);

/** AutoracePositionNumber zod型定義 */
const AutoracePositionNumberSchema = PositionNumberSchema(1, 8);

export type AutoracePositionNumber = z.infer<
    typeof AutoracePositionNumberSchema
>;

/** BoatracePositionNumber zod型定義 */
const BoatracePositionNumberSchema = PositionNumberSchema(1, 6);

export type BoatracePositionNumber = z.infer<
    typeof BoatracePositionNumberSchema
>;

/** KeirinPositionNumber zod型定義 */
const KeirinPositionNumberSchema = PositionNumberSchema(1, 9);

export type KeirinPositionNumber = z.infer<typeof KeirinPositionNumberSchema>;

/**
 * 共通のPositionNumber zod型定義
 */
export const CommonPositionNumberSchema = z.union([
    KeirinPositionNumberSchema,
    AutoracePositionNumberSchema,
    BoatracePositionNumberSchema,
]);

/**
 * 共通のPositionNumber型定義
 */
export type PositionNumber = z.infer<typeof CommonPositionNumberSchema>;
