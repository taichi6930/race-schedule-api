import { z } from 'zod';

/**
 * RaceDateTimeのzod型定義
 */
const RaceDateTimeSchema = z.date();

/**
 * RaceDateTimeの型定義
 */
export type RaceDateTime = z.infer<typeof RaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateRaceDateTime = (dateTime: Date): RaceDateTime =>
    RaceDateTimeSchema.parse(dateTime);
