import { z } from 'zod';

/**
 * HeldDayTimesのzod型定義
 */
const heldDayTimesSchema = z
    .number()
    .int()
    .min(1, '開催日数は1以上である必要があります');

/**
 * HeldDayTimesの型定義
 */
export type HeldDayTimes = z.infer<typeof heldDayTimesSchema>;

/**
 * HeldDayTimesのバリデーション関数
 * @param number - 開催日数
 * @returns - バリデーション済みの開催日数
 */
export const validateHeldDayTimes = (number: number): HeldDayTimes =>
    heldDayTimesSchema.parse(number);
