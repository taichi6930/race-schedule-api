import { z } from 'zod';

/**
 * HeldTimesのzod型定義
 */
const HeldTimesSchema = z
    .number()
    .int()
    .min(1, '開催回数は1以上である必要があります');

/**
 * HeldTimesの型定義
 */
export type HeldTimes = z.infer<typeof HeldTimesSchema>;

/**
 * HeldTimesのバリデーション関数
 * @param number - 開催回数
 * @returns - バリデーション済みの開催回数
 */
export const validateHeldTimes = (number: number): HeldTimes =>
    HeldTimesSchema.parse(number);
