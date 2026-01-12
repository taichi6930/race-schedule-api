import { z } from 'zod';

import type { LocationCode } from './locationCode';
import { RaceType } from './raceType';

/**
 * placeIdのzod型定義
 */
export const PlaceIdSchema = z
    .string()
    .regex(
        new RegExp(
            String.raw`^(${Object.values(RaceType).join('|')})\d{8}[0-9]{2}$`,
        ),
        `placeIdは「RaceType(${Object.values(RaceType).join(', ')})+yyyymmdd(8桁数字)+location_code(数字2桁)」形式で指定してください 例: JRA2025010501`,
    );

/**
 * placeIdの型定義
 */
export type PlaceId = z.infer<typeof PlaceIdSchema>;

/**
 * placeIdのバリデーション関数
 * @param value - placeId
 * @returns - バリデーション済みのplaceId
 */
export const validatePlaceId = (value: string): PlaceId =>
    PlaceIdSchema.parse(value);

/**
 * placeIdからRaceType・開催日・開催場所コードを取得する関数
 * @param placeId - placeId
 * @returns - RaceType・開催日・開催場所コード
 */
export const parsePlaceId = (
    placeId: PlaceId,
): {
    raceType: RaceType;
    date: Date;
    locationCode: LocationCode;
} => {
    // raceTypeはplaceIdから最後の10桁を除いた部分として取得
    const raceType = placeId.slice(0, -10) as RaceType;
    // dateは開催場所コードを除いた最後の8桁として取得
    const dateStr = placeId.slice(-10, -2);
    const date = new Date(
        Number(dateStr.slice(0, 4)),
        Number(dateStr.slice(4, 6)) - 1,
        Number(dateStr.slice(6, 8)),
    );
    // 最後の2桁を開催場所コードとして取得
    const locationCode = placeId.slice(-2);
    return {
        raceType,
        date,
        locationCode,
    };
};
