import { z } from 'zod';

/**
 * RaceNumberのzod型定義
 * 1~12の整数
 */
const RaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * RaceNumberの型定義
 */
export type RaceNumber = z.infer<typeof RaceNumberSchema>;

/**
 * レースのレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateRaceNumber = (number: number): RaceNumber =>
    RaceNumberSchema.parse(number);
