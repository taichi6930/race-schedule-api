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
/** AutoracePositionNumber zod型定義 */
const AutoracePositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(8, '枠番は8以下である必要があります');
export type AutoracePositionNumber = z.infer<
    typeof AutoracePositionNumberSchema
>;

/** BoatracePositionNumber zod型定義 */
const BoatracePositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(6, '枠番は6以下である必要があります');
export type BoatracePositionNumber = z.infer<
    typeof BoatracePositionNumberSchema
>;

/** KeirinPositionNumber zod型定義 */
const KeirinPositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(9, '枠番は9以下である必要があります');
export type KeirinPositionNumber = z.infer<typeof KeirinPositionNumberSchema>;

/**
 * RaceStageのzod型定義
 */
export const PositionNumberSchema = z.union([
    KeirinPositionNumberSchema,
    AutoracePositionNumberSchema,
    BoatracePositionNumberSchema,
]);

/**
 * RaceStageの型定義
 */
export type PositionNumber = z.infer<typeof PositionNumberSchema>;
