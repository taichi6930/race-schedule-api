import { z } from 'zod';

/**
 * HeldDayTimesのzod型定義
 */
export const HeldDayTimesSchema = z
    .number()
    .int()
    .min(1, '開催日数は1以上である必要があります');

/**
 * HeldDayTimesの型定義
 */
export type HeldDayTimes = z.infer<typeof HeldDayTimesSchema>;

/**
 * HeldDayTimesのバリデーション関数
 * @param value - 開催日数
 * @returns - バリデーション済みの開催日数
 */
export const validateHeldDayTimes = (value: number): HeldDayTimes =>
    HeldDayTimesSchema.parse(value);
