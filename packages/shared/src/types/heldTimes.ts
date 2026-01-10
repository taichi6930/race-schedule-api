import { z } from 'zod';

/**
 * HeldTimesのzod型定義
 */
export const HeldTimesSchema = z
    .number()
    .int()
    .min(1, '開催回数は1以上である必要があります');

/**
 * HeldTimesの型定義
 */
export type HeldTimes = z.infer<typeof HeldTimesSchema>;

/**
 * HeldTimesのバリデーション関数
 * @param value - 開催回数
 * @returns - バリデーション済みの開催回数
 */
export const validateHeldTimes = (value: number): HeldTimes =>
    HeldTimesSchema.parse(value);
