import { z } from 'zod';

import { RaceType } from './raceType';

/**
 * raceIdのzod型定義
 */
export const RaceIdSchema = z
    .string()
    .regex(
        new RegExp(
            String.raw`^(${Object.values(RaceType).join('|')})\d{8}[0-9]{4}$`,
        ),
        `raceIdは「RaceType(${Object.values(RaceType).join(', ')})+yyyymmdd(8桁数字)+location_code(数字2桁)+レース番号(数字2桁)」形式で指定してください 例: JRA202501050101`,
    );

/**
 * raceIdの型定義
 */
export type RaceId = z.infer<typeof RaceIdSchema>;

/**
 * raceIdのバリデーション関数
 * @param value - raceId
 * @returns - バリデーション済みのraceId
 */
export const validateRaceId = (value: string): RaceId =>
    RaceIdSchema.parse(value);
