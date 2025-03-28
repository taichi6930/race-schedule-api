import { z } from 'zod';

/**
 * JraRaceDateTimeのzod型定義
 */
const JraRaceDateTimeSchema = z.date();

/**
 * JraRaceDateTimeの型定義
 */
export type JraRaceDateTime = z.infer<typeof JraRaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateJraRaceDateTime = (dateTime: Date): JraRaceDateTime =>
    JraRaceDateTimeSchema.parse(dateTime);
