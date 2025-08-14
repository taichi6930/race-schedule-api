import { z } from 'zod';

import { RaceType } from '../../raceType';

/**
 * 枠順の最高値を取得します。
 * @param playerDataList
 * @param raceType - レース種別
 */
export const createMaxFrameNumber = (raceType: RaceType): number => {
    switch (raceType) {
        case RaceType.BOATRACE: {
            return 6;
        }
        case RaceType.AUTORACE: {
            return 8;
        }
        case RaceType.KEIRIN: {
            return 9;
        }
        case RaceType.JRA: {
            return 18;
        }
        case RaceType.NAR: {
            return 16;
        }
        case RaceType.WORLD: {
            // 一旦大きめに48にする
            return 48;
        }
        default: {
            return 0;
        }
    }
};

export const validatePositionNumber = (
    raceType: RaceType,
    positionNumber: number,
): PositionNumber => {
    switch (raceType) {
        case RaceType.AUTORACE:
        case RaceType.BOATRACE:
        case RaceType.KEIRIN: {
            return PositionNumberSchema(raceType).parse(positionNumber);
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
 * @param raceType - レース種別
 */
const PositionNumberSchema: (raceType: RaceType) => z.ZodNumber = (
    raceType,
) => {
    const max = createMaxFrameNumber(raceType);
    return z
        .number()
        .int()
        .min(1, `枠番は1以上である必要があります`)
        .max(max, `枠番は${max}以下である必要があります`);
};

/**
 * 共通のPositionNumber zod型定義
 */
export const CommonPositionNumberSchema = z.union([
    PositionNumberSchema(RaceType.KEIRIN),
    PositionNumberSchema(RaceType.AUTORACE),
    PositionNumberSchema(RaceType.BOATRACE),
]);

/**
 * 共通のPositionNumber型定義
 */
export type PositionNumber = z.infer<typeof CommonPositionNumberSchema>;
